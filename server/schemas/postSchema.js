const { GraphQLError } = require("graphql")
const { ObjectId } = require("mongodb")
const redis = require('../config/redis')

const createdAt = updatedAt = new Date()

const postTypeDefs = `#graphql 
    scalar Date

    type Post {
        _id: ID
        content: String!
        tags: [String]
        imgUrl: String
        Author: Author
        Comments: [Comment]
        Likes: [Like]
        createdAt: Date
        updatedAt: Date
    }

    type Author {
        _id: ID
        name: String
        username: String
    }

    type Comment {
        content: String!
        username: String!
        createdAt: Date
        updatedAt: Date
    }

    type Like { 
        username: String!
        createdAt: Date
        updatedAt: Date
    }
    
    type Follow {
        _id: ID
        followingId: String
        followerId: String
        createdAt: Date
        updatedAt: Date
    }

    input InputPost {
        content: String!
        tags: [String]
        imgUrl: String
    }

    type outputMessage {
        message: String
    }

    type Query {
        getPosts: [Post]
        getPostById(postId: ID): Post
    }

    type Mutation {
        addPost(input: InputPost): outputMessage
        commentPost(postId: ID, content: String!): outputMessage
        likePost(postId: ID): outputMessage
    }
`

const postResolver = {
    Query: {
        getPosts: async (_, __, context) => {
            try {
                const { db } = context
                const cachePosts = await redis.get("all:post")
                // await context.authentication()

                if (cachePosts) {
                    return JSON.parse(cachePosts)
                }

                const query = [
                    {
                        '$lookup': {
                            'from': 'User',
                            'localField': 'authorId',
                            'foreignField': '_id',
                            'as': 'Author'
                        }
                    }, {
                        '$unwind': {
                            'path': '$Author'
                        }
                    }, {
                        '$project': {
                            'Author.password': 0,
                            'Author.email': 0
                        }
                    }, {
                        '$sort': {
                            'updatedAt': -1
                        }
                    }
                ]

                const posts = await db.collection("Posts").aggregate(query).toArray()

                await redis.set("all:post", JSON.stringify(posts))

                return posts
            } catch (error) {
                console.log(error, "Error on schemas")
                throw error
            }
        },
        getPostById: async (_, args, context) => {
            try {
                const { db } = context
                const { postId } = args
                await context.authentication()

                if (!postId) throw new GraphQLError("please provide a valid id", {
                    extensions: {
                        code: "400 BAD_REQUEST",
                    }
                })

                const query = [
                    {
                        '$match': {
                            '_id': new ObjectId(postId)
                        }
                    }, {
                        '$lookup': {
                            'from': 'User',
                            'localField': 'authorId',
                            'foreignField': '_id',
                            'as': 'Author'
                        }
                    }, {
                        '$unwind': {
                            'path': '$Author'
                        }
                    }, {
                        '$project': {
                            'authorId': 0,
                            'Author._id': 0,
                            'Author.name': 0,
                            'Author.password': 0,
                            'Author.email': 0
                        }
                    }]

                const post = await db.collection("Posts").aggregate(query).toArray()

                if (!post.length) {
                    throw new GraphQLError("Post not found", {
                        extensions: {
                            code: "404 NOT_FOUND",
                        }
                    })
                }

                return post[0]
            } catch (error) {
                console.log(error, "Error on schemas")
                throw error
            }
        }
    },
    Mutation: {
        addPost: async (_, args, context) => {
            try {
                const { db } = context
                const { authorId } = await context.authentication()

                const { content, tags, imgUrl } = args.input

                if (!content) {
                    throw new GraphQLError("Please provide some content", {
                        extensions: {
                            code: "400 BAD_REQUEST",
                        }
                    })
                }

                await db.collection("Posts").insertOne({ content, tags, imgUrl, authorId, createdAt, updatedAt })

                await redis.del("all:post")

                return { message: "Success add post" }
            } catch (error) {
                throw error
            }
        },
        commentPost: async (_, args, context) => {
            try {
                const { db } = context
                const { username } = await context.authentication()
                const { postId, content } = args

                const postObjId = new ObjectId(postId)

                const post = await db.collection("Posts").findOne({ _id: postObjId })

                console.log(post)

                if (!post) {
                    throw new GraphQLError("Post not found", {
                        extensions: {
                            code: "404 NOT_FOUND",
                        }
                    })
                }

                if (!content) {
                    throw new GraphQLError("Please provide a content for the comment", {
                        extensions: {
                            code: "400 BAD_REQUEST",
                        }
                    })
                }

                const comment = {
                    content,
                    username,
                    createdAt,
                    updatedAt
                }

                await db.collection("Posts").updateOne(
                    { _id: postObjId },
                    { $push: { Comments: comment } }
                )

                await redis.del("all:post")

                return { message: "Success add comment" }
            } catch (error) {
                console.log(error, "Error on schemas")
                throw error
            }
        },
        likePost: async (_, args, context) => {
            try {
                const { db } = context
                let { username } = await context.authentication()
                const { postId } = args

                const postObjId = new ObjectId(postId)

                const post = await db.collection("Posts").findOne({ _id: postObjId })

                if (!post) {
                    throw new GraphQLError("Post not found", {
                        extensions: {
                            code: "404 NOT_FOUND",
                        }
                    })
                }

                let message = "Success Like post"

                if (post?.Likes?.some(like => like.username === username)) {
                    await db.collection('Posts').updateOne(
                        { _id: postObjId },
                        { $pull: { Likes: { username: username } } }
                    )
                    message = "Success Unlike post"
                } else {
                    await db.collection("Posts").updateOne(
                        { _id: postObjId },
                        { $push: { Likes: { username, createdAt, updatedAt } } }
                    )
                }

                await redis.del("all:post")

                return { message }
            } catch (error) {
                console.log(error, "Error on s")
                throw error
            }
        }
    }
}

module.exports = { postTypeDefs, postResolver }
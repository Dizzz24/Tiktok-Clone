const { GraphQLError } = require("graphql")
const { ObjectId } = require("mongodb")

const createdAt = updatedAt = new Date()

const followTypeDefs = `#graphql
     scalar Date

type outputMessage {
    message: String
}

type Mutation {
    followUser(followingId: ID): outputMessage
}
`

const followResolver = {
    Mutation: {
        followUser: async (_, args, context) => {
            try {
                const { db } = context
                let { followingId } = args
                const { authorId: followerId } = await context.authentication()

                followingId = new ObjectId(followingId)

                if (followingId.equals(followerId)) {
                    throw new GraphQLError("Cannot follow yourself", {
                        extensions: {
                            code: "409 CONFLICT",
                        }
                    })
                }

                const user = await db.collection("User").findOne({ _id: followingId })

                if (!user) {
                    throw new GraphQLError("User not found", {
                        extensions: {
                            code: "404 NOT_FOUND",
                        }
                    })
                }

                const isAlreadyFollow = await db.collection('Follows').findOne({
                    followingId,
                    followerId,
                });

                let message = "Success follow user"

                if (isAlreadyFollow) {
                    await db.collection('Follows').deleteOne({ _id: isAlreadyFollow._id });
                    message = "Success unfollow user"
                } else {
                    await db.collection("Follows").insertOne({
                        followingId,
                        followerId,
                        createdAt,
                        updatedAt
                    })
                }

                return { message }
            } catch (error) {
                throw error
            }
        }
    }
}

module.exports = { followTypeDefs, followResolver }

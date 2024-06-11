const { GraphQLError } = require("graphql");
const hashPassword = require("../helpers/hashPassword")
const { ObjectId } = require("mongodb")
const { signToken } = require("../helpers/jwt")
const bcryptjs = require("bcryptjs")

const userTypeDefs = `#graphql 
type Post {
        _id: ID
        content: String!
        tags: [String]
        imgUrl: String
        Comments: [Comment]
        Likes: [Like]
        createdAt: Date
        updatedAt: Date
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

    type User {
        _id: ID
        name: String
        username: String 
        email: String
    }

    type UserWithFollowers {
        _id: ID
        name: String
        username: String
        email: String
        Posts: [Post]
        followers: [String]
        following: [String]
    }

    type ResponLogin {
        access_token: String
    }

    input InputRegister {
        name: String
        username: String
        email: String
        password: String
    }

    input InputLogin {
        username: String!
        password: String!
    }

    type Query {
        getUserById(userId: ID): UserWithFollowers
        getUserByNameOrUname(nameOrUname: String): User
    }

    type Mutation {
        addUser(input: InputRegister): User
        login(input: InputLogin): ResponLogin
    }
`

const userResolver = {
    Query: {
        getUserById: async (_, args, context) => {
            try {
                const { db } = context;
                let { userId } = args;

                if (!userId) throw new GraphQLError("Please provide a valid ID", {
                    extensions: {
                        code: "400 BAD_REQUEST",
                    }
                });

                userId = new ObjectId(userId)

                let user = await db.collection("User").aggregate([
                    {
                        $match: { _id: userId }
                    },
                    {
                        $lookup: {
                            from: "Posts",
                            localField: "_id",
                            foreignField: "authorId",
                            as: "Posts"
                        },
                    },
                    {
                        $project: {
                            "Posts.authorId": 0
                        }
                    }
                ]).toArray();

                user = user[0]

                console.log(user, "usernihh")

                if (!user) throw new GraphQLError("User not found", {
                    extensions: {
                        code: "404 NOT_FOUND",
                    }
                });

                const aggFollower = [
                    { $match: { followingId: userId } },
                    { $lookup: { from: "User", localField: "followerId", foreignField: "_id", as: "followers" } },
                    { $unwind: "$followers" },
                    { $project: { _id: 0, username: "$followers.username" } }
                ];

                const aggFollowing = [
                    { $match: { followerId: userId } },
                    { $lookup: { from: "User", localField: "followingId", foreignField: "_id", as: "following" } },
                    { $unwind: "$following" },
                    { $project: { _id: 0, username: "$following.username" } }
                ];

                const followers = await db.collection("Follows").aggregate(aggFollower).toArray();
                const following = await db.collection("Follows").aggregate(aggFollowing).toArray();

                return {
                    ...user,
                    followers: followers.map(f => { username: f.username }),
                    following: following.map(f => { username: f.username })
                };
            } catch (error) {
                console.log(error, "Error on schemas")
                throw error
            }
        },
        getUserByNameOrUname: async (_, args, context) => {
            try {
                const { db } = context;
                const { nameOrUname } = args

                if ((nameOrUname && !nameOrUname.trim())) {
                    throw new GraphQLError("please provide name/username!", {
                        extensions: {
                            code: "400 INPUT_REQUIRED",
                        }
                    });
                }

                const user = await db.collection("User").findOne({ $or: [{ name: nameOrUname }, { username: nameOrUname }] });

                if (!user) {
                    throw new GraphQLError("User not found", {
                        extensions: {
                            code: "404 NOT_FOUND"
                        },
                    });
                }

                return user
            } catch (error) {
                console.log(error, "Error on schemas")
                throw error
            }
        }
    },
    Mutation: {
        addUser: async (_, args, context) => {
            try {
                const { db } = context
                const { name, username, email, password } = args.input

                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const isEmail = regex.test(email);

                if (!username.trim() || !password.trim() || !email.trim()) {
                    throw new GraphQLError("username, email or password is required", {
                        extensions: {
                            code: "400 Bad_Request",
                        }
                    });
                }

                if (!isEmail) {
                    throw new GraphQLError("Invalid email format", {
                        extensions: {
                            code: "400 BAD_REQUEST",
                        }
                    });
                }

                if (password.length < 5) throw new GraphQLError("Minimum length password is 5", {
                    extensions: {
                        code: "400 BAD_REQUEST",
                    }
                });

                const user = await db.collection("User").findOne({ $or: [{ username }, { email }] });

                console.log(user, "userniihhh")

                if (user) {
                    throw new GraphQLError("Username or Email must be uniq", {
                        extensions: {
                            code: "400 BAD_REQUEST",
                        }
                    });
                }

                const newUser = {
                    name,
                    username,
                    email,
                    password: hashPassword(password)
                }

                const userCollection = db.collection("User")
                const result = await userCollection.insertOne(newUser)

                return { _id: result.insertedId, ...newUser }
            } catch (error) {
                console.log(error, "Error di migrasi 1")
                throw error
            }
        },
        login: async (_, args, context) => {
            try {
                const { db } = context
                const { username, password } = args.input

                if (!username.trim() || !password.trim()) {
                    throw new GraphQLError("username or password is required", {
                        extensions: {
                            code: "400 Bad_Request",
                        }
                    });
                }

                const userCollection = db.collection("User")
                const user = await userCollection.findOne({ username: username })

                if (!user) {
                    throw new GraphQLError("Invalid username or password", {
                        extensions: {
                            code: "401 Unauthorized",
                        }
                    });
                }

                const validPassword = bcryptjs.compareSync(password, user.password)

                if (!validPassword) {
                    throw new GraphQLError("Invalid username or password", {
                        code: "401 Unauthorized"
                    });
                }

                const payload = { id: user._id }

                const access_token = signToken(payload)

                console.log(access_token)

                return { access_token }
            } catch (error) {
                console.log(error, "Error di migrasi 2")
                throw error
            }
        }
    }
}

module.exports = { userTypeDefs, userResolver }
const { ObjectId } = require("mongodb");
const { verifyToken } = require("../helpers/jwt");
const { getDB } = require("../config/mongo")

const { GraphQLError } = require("graphql");

const authentication = async (req) => {
    try {
        const db = await getDB()
        if (!req.headers.authorization) {
            throw new GraphQLError("Invalid Token", {
                extensions: {
                    code: "401 NOT_AUTHENTENTICATED",
                }
            });
        }
        
        const token = req.headers.authorization.split(' ')[1]
        
        const payload = verifyToken(token)

        console.log(payload, "payload nih")

        const userCollection = db.collection("User")
        const user = await userCollection.findOne({ _id: new ObjectId(payload.id) })

        if (!user) {
            throw new GraphQLError("Invalid Token", {
                extensions: {
                    code: "401 NOT_AUTHENTENTICATED",
                }
            });
        }

        return { authorId: user._id, username: user.username }
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            throw new GraphQLError("Invalid Token", {
                extensions: {
                    code: "401 NOT_AUTHENTENTICATED",
                }
            });
        }
        throw error
    }
}

module.exports = authentication
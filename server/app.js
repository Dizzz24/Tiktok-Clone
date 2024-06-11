require("dotenv").config()
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { tryConnection, getDB } = require("./config/mongo")
const authentication = require('./middleware/authentication');

const { userTypeDefs, userResolver } = require("./schemas/userSchema.js");
const { postTypeDefs, postResolver } = require("./schemas/postSchema.js");
const { followTypeDefs, followResolver } = require("./schemas/followSchema.js");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolver, postResolver, followResolver],
  introspection: true
});

(async () => {
  try {
    await tryConnection()

    const db = await getDB()

    const { url } = await startStandaloneServer(server, {
      listen: { port: process.env.PORT || 3000 },
      context: ({ req }) => ({
        db,
        authentication: () => authentication(req)
      })
    })

    console.log(`Jalan di ${url}`)
  } catch (error) {
    console.log(error, "Error di app")
  }
})()
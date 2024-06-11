const { MongoClient } = require("mongodb")
const { mongoDB_URI } = process.env

const client = new MongoClient(mongoDB_URI)

async function tryConnection() {
    try {
        return client.db("TickTockDB");
    } catch (error) {
        await client.close();
    }
}

async function getDB() {
    return client.db("TickTockDB");
}

module.exports = { tryConnection, getDB }
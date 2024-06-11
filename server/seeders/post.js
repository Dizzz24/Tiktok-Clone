const hashPassword = require("../helpers/hashPassword")
const { tryConnection } = require("../config/mongo")

const createdAt = updatedAt = new Date()

const posts = [
    {
        content: "Postingan 1",
        imgUrl: "http://",
        createdAt,
        updatedAt
    },
    {
        content: "Postingan 2",
        imgUrl: "http://",
        createdAt,
        updatedAt
    }
]

async function seedPosts() {
    try {
        const db = await tryConnection()
        const user = await db.collection("User").findOne({ name: "user1" })

        await db.collection("Posts").insertMany(posts)

        console.log("=========== SUCCESS SEEDING POST ===========")
    } catch (error) {
        console.log("=========== FAILED SEEDING POST ===========", error)
    }
}

module.exports = seedPosts
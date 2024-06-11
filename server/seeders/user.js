const hashPassword = require("../helpers/hashPassword")
const { tryConnection } = require("../config/mongo")

const users = [
    {
        name: "user1",
        username: "user1",
        email: "user1@mail.com",
        password: "user1"
    },
    {
        name: "user2",
        username: "user2",
        email: "user2@mail.com",
        password: "user2"
    }
]

async function seedUser() {
    try {
        const dataUser = users.map(el => {
            el.password = hashPassword(el.password)

            return el
        })

        const db = await tryConnection()
        await db.collection("User").insertMany(dataUser)

        console.log("=========== SUCCESS SEEDING USER ===========")
    } catch (error) {
        console.log("=========== FAILED SEEDING USER ===========", error)
    }
}

module.exports = seedUser
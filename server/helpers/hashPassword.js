const bcryptjs = require("bcryptjs")

module.exports = (password) => bcryptjs.hashSync(password)
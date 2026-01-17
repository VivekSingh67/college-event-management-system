const mongoose = require('mongoose');

const connectToDB = () => {
    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log("DB Connected")
    }).catch((error) => {
        console.log(error.message)
    })
}

module.exports = connectToDB;
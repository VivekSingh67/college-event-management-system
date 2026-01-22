const authModel = require('../models/auth.model')
const jwt = require('jsonwebtoken')

const authUserMiddleware = async (req, res, next) => {
    let token = req.cookies.token
    if (!token) {
        res.status(400).json({
            message: "Please Login First"
        })
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET)
        let user = await authModel.findById(decoded.id)
        req.user = user
        return next()
    } catch (error) {
        return res.status(401).json({
            message: "Invalid Token"
        })
    }
}

module.exports = { authUserMiddleware }
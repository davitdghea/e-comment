const jwt = require('jsonwebtoken')
const generatAccessToken = (uid,role) =>jwt.sign({_id:uid,role}, process.env.JWT_SECRET,{expiresIn:"1d"})
const generateReAccessToken = (uid) =>jwt.sign({_id:uid}, process.env.JWT_SECRET,{expiresIn:"3d"})

module.exports = {
    generatAccessToken,
    generateReAccessToken
}
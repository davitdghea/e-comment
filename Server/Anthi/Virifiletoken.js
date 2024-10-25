const jwt = require("jsonwebtoken")
const asyncHend = require("express-async-handler")


//bearer taken
//authorization

const verifileAccessToken = asyncHend(async(req,res,next)=>{
    if(req?.headers?.authorization?.startsWith('Bearer')){
        const token = req.headers.authorization.split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET,(err,docode)=>{
        if(err) return res.status(401).json({
            success:false,
            mes:"invalid access token"
        })
        req.user = docode
        next()
    })
    }else{
        return res.status(401).json({
            success:false,
            mes:"require authorizattion"
        })
    }
})
const isAdmin = asyncHend((req,res,next) =>{
const {role} = req.user
if(+role !== 1945)
    return res.status(401).json({
      success:false,
      mes:'REQUIRE ADMIN ROLE'
    })
    next()
})
module.exports={
    verifileAccessToken,
    isAdmin
}
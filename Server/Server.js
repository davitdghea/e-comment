const express = require("express")
require('dotenv').config()
const dbConnect = require("./config/mongoose")
const initRouter = require("./routers")
const cookieParser = require("cookie-parser")
const cors = require('cors')


const app = express()
app.use(cors({
    origin: process.env.CLIEN_URL,
    methods:['POST','PUT','GET','DELETE'],
    credentials: true
}))
app.use(cookieParser())
const port = process.env.PORT || 8088
app.use(express.json())
app.use(express.urlencoded({ extended:true}))
dbConnect()
initRouter(app)

app.listen(port,()=>{
    console.log("SErver running on the port: " + port)
})
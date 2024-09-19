const {default:mongoose} = require('mongoose')
mongoose.set('strictQuery', false)
const dbConnect = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        if(conn.connection.readyState === 1)console.log("thành cok")
            else console.log("false db")
    }catch(error){
      
        throw new Error(error)
    }
}

module.exports = dbConnect
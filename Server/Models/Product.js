const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    slug:{
        type:String,
     // unique:true,
        required:true,
        lowercase:true,
    },
    description:{
        type:Array,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        default:0,
    },
    soId:{
        type:String,
        default:0,
    },
    thumb:{
        type: String,
    },
    images:{
        type:Array,
    },
    color:{
        type:String,
        required:true
        
    },
    ratings:[{
        star:{type:Number},
        postedBy:{type:mongoose.Types.ObjectId,ref:'User'},
        comment:{type:String},
        updatedAt:{
            type:Date,
            
        }
    }],
    totalRatings:{
        type:Number,
        default:0
    },
    variants:[
        {
            color:String,
            price:Number,
            thumb:String,
            images:Array,
            title:String,
            sku:String
        }
    ]
},{
    timestamps:true,
});

//Export the model
module.exports = mongoose.model('Product', productSchema);
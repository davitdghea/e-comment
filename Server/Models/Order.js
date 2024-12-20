const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products:[{      
            product: { type: mongoose.Types.ObjectId, ref: 'Product' },
            quantity: Number,
            color: String,
            price: String,
            thumb: String,
            title: String,
    }],
   status:{
        type:String,
       enum: ["Cancelled", 'Available', 'Transport', 'Succeed', 'False','Order','Refund'],
    },
    total: Number,
    orderBy:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    deliveryCode:{
        type:String
    },
    address:{
        type:String
    }
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('order', orderSchema);
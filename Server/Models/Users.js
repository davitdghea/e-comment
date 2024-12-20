const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt")
const crypto = require("crypto")
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,

    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    money:{
        type: Number,
    },
    avatar: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [1945, 1979],
        default: 1979,
    },
    cart: [{
        product: { type: mongoose.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        color: String,
        price: String,
        thumb: String,
        title: String,

    }],
    history:[{
         nap: Number,     
         rut: Number,
         time: { type: Date, default: Date.now }
    }],
    address: String,
    wishList: [{
        pid: { type: mongoose.Types.ObjectId, ref: 'Product' },
        thumb: String,
        title: String,
        category: String,
        price: Number,
        color: String
    }],
    isBlocked: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
    },
    passwordChangedAT: {
        type: String,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: String,
    },
    resgeterToken: {
        type: String,
    }
}, {
    timestamps: true
});
// hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    const salt = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
})
userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password)
    },
    createPasswordChangedToken: function () {
        const resetToken = crypto.randomBytes(32).toString("hex")
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000
        return resetToken
    }
}

//Export the model
module.exports = mongoose.model('User', userSchema);
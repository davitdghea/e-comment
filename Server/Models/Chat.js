const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    fromUserAvatar: { type: String },
    fromUserName: { type: String, }, 
    fromUserID: { type: String, required: true },  // ID người gửi
    toUserID: { type: String, required: true },    // ID người nhận
    message: { type: String },     // Nội dung tin nhắn
    timestamp: { type: Date, default: Date.now },  // Thời gian gửi
    isRead: { type: Boolean, default: false },
    file: { type: String },  
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

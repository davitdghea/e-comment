const express = require("express");
const Message = require('./Models/Chat');
require('dotenv').config();
const dbConnect = require("./config/mongoose");
const initRouter = require("./routers");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const app = express();
const path = require('path');
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIEN_URL,
        methods: ['POST', 'PUT', 'GET', 'DELETE'],
        credentials: true
    }
});
app.use(cors({
    origin: process.env.CLIEN_URL,
    methods: ['POST', 'PUT', 'GET', 'DELETE'],
    credentials: true
}));
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir)); 
app.use(cookieParser());
const port = process.env.PORT || 8088;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect();
initRouter(app);
let onlineUsers = {};
io.on('connection', (socket) => {
    socket.on('setUser', (data) => {
        const userId = data.userId;
        socket.join(userId); 
        
    });
    const userId = socket.handshake.query.userId;
    onlineUsers[userId] = 'online';

    // Gửi danh sách trạng thái online của tất cả người dùng cho người kết nối mới
    socket.emit("updateUserStatuses", onlineUsers);

    // Phát tín hiệu online cho những người khác
    socket.broadcast.emit("userStatusChange", { userId, status: "online" });
    socket.on('send-file', (data) => {
        const { buffer, senderId } = data;
        if (!buffer) {
            console.error('Không nhận được buffer từ client');
            return;
        }

        const fileName = `${senderId}-${Date.now()}.jpg`;
        const filePath = `./uploads/${fileName}`;

        fs.writeFile(filePath, Buffer.from(buffer), (err) => {
            if (err) {
                console.error('Lỗi lưu file:', err);
                return;
            }
            socket.emit('receive-file', { file: `/uploads/${fileName}`, senderId });
        });
    });

    socket.on('sendMessage', async (data) => {
        const { senderId, recipientId, message, senderName, senderAvatar, filePath } = data;
        console.log(filePath)
        if (!senderId || !recipientId ) {
            console.error('Thiếu thông tin senderId, recipientId hoặc message');
            return;
        }
        const newMessage = new Message({
            fromUserAvatar: senderAvatar,
            fromUserName: senderName,
            fromUserID: senderId,
            toUserID: recipientId,
            message: message,
            file: filePath || null
        });
        await newMessage.save();
        io.to(recipientId).emit('receiveMessage', data);
    });
    socket.on('disconnectUser', (data) => {
        const userId = data.userId;
        io.emit('userStatusChange', { userId, status: 'offline' });
    });
    socket.on('disconnect', () => {
        delete onlineUsers[userId];
        io.emit("userStatusChange", { userId, status: "offline" });
    });
});

app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    next();
});

server.listen(port, () => {
    console.log("Server running on the port: " + port);
});

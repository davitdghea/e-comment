const asyncHandler = require('express-async-handler')
const Message = require("../Models/Chat")

const getMessages = asyncHandler(async (req, res) => {
    const { recipientId = '670f5f0bcb44f62340a29d24' } = req.query;
    const latestMessages = await Message.aggregate([
        { $match: { toUserID: recipientId } }, 
        { $sort: { timestamp: -1 } }, 
        { $group: { _id: "$fromUserID", latestMessage: { $first: "$$ROOT" } } }, 
        { $replaceRoot: { newRoot: "$latestMessage" } }
    ]);
    if (latestMessages.length === 0) {
        return res.json([]);
    }
    const messages = [];
    for (let msg of latestMessages) {
        const latestMessage = await Message.findOne({
            $or: [
                { toUserID: recipientId, fromUserID: msg.fromUserID },
                { fromUserID: recipientId, toUserID: msg.fromUserID }
            ]
        })
        .sort({ timestamp: -1 }) 
        .exec();

        if (latestMessage) {
            messages.push(latestMessage); 
        }
    } 
    messages.sort((a, b) => b.timestamp - a.timestamp);
    res.json(messages);
});



const getMessageOne = asyncHandler(async (req, res) => {
    const { fromUserID, toUserID } = req.query;
    const messages = await Message.find({
        $or: [
            { fromUserID: fromUserID, toUserID: toUserID },
            { fromUserID: toUserID, toUserID: fromUserID }
        ]
    }).sort({ timestamp: 1 });
    res.json(messages);
});
const updateMessage = asyncHandler(async (req, res) => { 
    const { fromUserID, toUserID } = req.query;
    const messages = await Message.updateMany({
        $or: [
            { fromUserID: fromUserID, toUserID: toUserID },
        ]
    }, {isRead : true});
    res.json(messages);
});
module.exports = {
    getMessages,
    updateMessage,
    getMessageOne,
}

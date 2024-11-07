const asyncHandler = require('express-async-handler')
const Message = require("../Models/Chat")

const getMessages = asyncHandler(async (req, res) => {
    const { recipientId = '670f5f0bcb44f62340a29d24' } = req.query;
    const latestMessages = await Message.aggregate([
        { $match: { toUserID: recipientId } },
        { $sort: { timestamp: -1 } },
        { $group: { _id: "$fromUserID", latestMessage: { $first: "$$ROOT" } } },
        { $replaceRoot: { newRoot: "$latestMessage" } },
    ]);
    const latestMessage = await Message.find({
        $or: [
            { toUserID: recipientId, fromUserID: latestMessages[0].fromUserID }, 
            { fromUserID: recipientId, toUserID: latestMessages[0].fromUserID }  
        ]
    })
        .sort({ timestamp: -1 }) 
        .limit(1) 
        .exec();

    res.json(latestMessage);
   
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

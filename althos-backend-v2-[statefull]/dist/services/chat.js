"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
exports.getSuggestedFriends = getSuggestedFriends;
exports.sendMessageToMongo = sendMessageToMongo;
exports.getMessagesFromMongo = getMessagesFromMongo;
const mongodb_1 = require("mongodb");
// MongoDB URI - replace with your actual connection string
const uri = "mongodb+srv://user:TsXx95NRMbfBlLTO@althos.gofpvie.mongodb.net/?appName=althos";
// MongoClient options with Stable API
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
exports.client = client;
// Connect and get DB promise
const dbPromise = client.connect().then(() => client.db("althos"));
// Get User collection
async function getUserCollection() {
    const db = await dbPromise;
    return db.collection('users');
}
// Get Messages collection
async function getMessageCollection() {
    const db = await dbPromise;
    return db.collection('messages');
}
// Utility: ObjectId from string
function toObjectId(id) {
    try {
        return new mongodb_1.ObjectId(id);
    }
    catch {
        throw new Error('Invalid ObjectId string: ' + id);
    }
}
// Fetch suggested friends based on age and hobbies
async function getSuggestedFriends(userId, age, hobbies) {
    const userCol = await getUserCollection();
    const oid = toObjectId(userId);
    const friends = await userCol.find({
        _id: { $ne: oid },
        age: { $gte: age - 4, $lte: age + 4 },
        hobbies: { $elemMatch: { $in: hobbies } }
    }).toArray();
    return friends.filter(u => Array.isArray(u.hobbies) && hobbies.filter(h => u.hobbies?.includes(h)).length >= 3);
}
// Save a chat message
async function sendMessageToMongo(conversationId, senderId, receiverId, text) {
    const messagesCol = await getMessageCollection();
    const now = new Date();
    await messagesCol.insertOne({
        _id: new mongodb_1.ObjectId(),
        conversationId,
        sender: senderId,
        receiver: receiverId,
        text,
        timestamp: now,
    });
}
// Get messages of a conversation sorted by time ascending
async function getMessagesFromMongo(conversationId) {
    const messagesCol = await getMessageCollection();
    return messagesCol.find({ conversationId })
        .sort({ timestamp: 1 })
        .toArray();
}

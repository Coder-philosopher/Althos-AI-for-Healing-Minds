import { MongoClient, ServerApiVersion, Db, Collection, ObjectId } from 'mongodb';
import { User } from '../types';
// MongoDB URI - replace with your actual connection string
const uri = "mongodb+srv://user:TsXx95NRMbfBlLTO@althos.gofpvie.mongodb.net/?appName=althos";

// MongoClient options with Stable API
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect and get DB promise
const dbPromise: Promise<Db> = client.connect().then(() => client.db("althos"));

// Interfaces

export interface Message {
  _id: ObjectId;
  conversationId: string;
  sender: string;
  receiver: string;
  text: string;
  timestamp: Date;
}

// Get User collection
async function getUserCollection(): Promise<Collection<User>> {
  const db = await dbPromise;
  return db.collection<User>('users');
}

// Get Messages collection
async function getMessageCollection(): Promise<Collection<Message>> {
  const db = await dbPromise;
  return db.collection<Message>('messages');
}

// Utility: ObjectId from string
function toObjectId(id: string): ObjectId {
  try {
    return new ObjectId(id);
  } catch {
    throw new Error('Invalid ObjectId string: ' + id);
  }
}

// Fetch suggested friends based on age and hobbies
export async function getSuggestedFriends(
  userId: string,
  age: number,
  hobbies: string[]
): Promise<User[]> {
  const userCol = await getUserCollection();
  const oid = toObjectId(userId);
  const friends = await userCol.find({
    _id: { $ne: oid },
    age: { $gte: age - 4, $lte: age + 4 },
    hobbies: { $elemMatch: { $in: hobbies } }
  }).toArray();

  return friends.filter(u =>
    Array.isArray(u.hobbies) && hobbies.filter(h => u.hobbies?.includes(h)).length >= 3
  );
}

// Save a chat message
export async function sendMessageToMongo(
  conversationId: string,
  senderId: string,
  receiverId: string,
  text: string
): Promise<void> {
  const messagesCol = await getMessageCollection();
  const now = new Date();

  await messagesCol.insertOne({
    _id: new ObjectId(),
    conversationId,
    sender: senderId,
    receiver: receiverId,
    text,
    timestamp: now,
  });
}

// Get messages of a conversation sorted by time ascending
export async function getMessagesFromMongo(
  conversationId: string
): Promise<Message[]> {
  const messagesCol = await getMessageCollection();
  return messagesCol.find({ conversationId })
    .sort({ timestamp: 1 })
    .toArray();
}

// Export MongoClient for graceful application shutdown if needed
export { client };

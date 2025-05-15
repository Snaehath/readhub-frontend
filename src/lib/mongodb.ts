import { MongoClient } from "mongodb";

const uri: string | undefined = "mongodb+srv://root:abc123ABC123@cluster0.qo5wjbl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const options = {};

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
  _mongoClient?: MongoClient;
};

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(uri, options);
}

export default client;

import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, use global to preserve client across reloads
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production, create fresh instance
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Schema for blog content collection
export interface BlogContent {
  _id?: string;
  blog_url: string;
  title: string;
  content: string;
  scraped_at: Date;
  word_count: number;
  author?: string;
  published_date?: string;
}

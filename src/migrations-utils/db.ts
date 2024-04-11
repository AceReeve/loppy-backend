import { MongoClient, MongoClientOptions } from 'mongodb';
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

console.log(
  `Loaded environment: ${process.env.NODE_ENV} - ${process.env.MONGO_HOSTNAME}`,
);

const MONGO_URL =
  process.env.MONGODB_URL || 'mongodb://localhost:27017/service-hero';

console.log('MongoDB URI:', MONGO_URL); // Add this line for debugging

export const getDb = async () => {
  const client: MongoClient = await MongoClient.connect(MONGO_URL, {
    useUnifiedTopology: true,
  } as MongoClientOptions);
  return client.db();
};

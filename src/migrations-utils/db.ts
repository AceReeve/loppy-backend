import { MongoClient, MongoClientOptions } from 'mongodb';
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const MONGO_URL = process.env.MONGODB_URL;
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const MONGO_CLUSTER_NAME = process.env.MONGO_CLUSTER_NAME;

export const getDb = async () => {
  let client: MongoClient;

  if (MONGO_URL) {
    client = await MongoClient.connect(MONGO_URL, {
      useUnifiedTopology: true,
    } as MongoClientOptions);
  } else if (
    MONGO_HOSTNAME &&
    MONGO_USERNAME &&
    MONGO_PASSWORD &&
    MONGO_DB_NAME &&
    MONGO_CLUSTER_NAME
  ) {
    const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}/${MONGO_DB_NAME}?retryWrites=true&w=majority&appName=${MONGO_CLUSTER_NAME}`;
    client = await MongoClient.connect(uri, {
      useUnifiedTopology: true,
    } as MongoClientOptions);
  } else {
    throw new Error('MongoDB configuration missing for non-local environment.');
  }

  return client.db();
};

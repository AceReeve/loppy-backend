import { MongoClient, MongoClientOptions } from 'mongodb';
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

console.log(
  `Loaded environment: ${process.env.NODE_ENV} - ${process.env.MONGO_HOSTNAME}`,
);

const { MONGO_HOSTNAME, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB_NAME } = process.env;

// add the mongo url from env
const MONGO_URL = `${MONGO_HOSTNAME}://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.oh6xtoy.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`;

console.log('MongoDB URI:', MONGO_URL); // Add this line for debugging

export const getDb = async () => {
  const client: MongoClient = await MongoClient.connect(MONGO_URL, {
    useUnifiedTopology: true,
  } as MongoClientOptions);
  return client.db();
};

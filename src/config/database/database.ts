import {env} from '../.env';

import mongoose from 'mongoose';

// Get the MongoDB URI from the environment variables
const uri = env.mongoURI ;

// Connect to MongoDB using Mongoose
export const connectDB = async (): Promise<void> => {
  try {
    console.log(`Connecting to MongoDB at ${uri}`);
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected (Mongoose): ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1);
  }
};

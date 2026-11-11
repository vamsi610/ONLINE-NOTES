import mongoose from 'mongoose';

/**
 * MongoDB Connection Utility
 * Connects to MongoDB database using Mongoose ODM.
 */
let isConnected = false;

export const connectDB = async (customUri?: string): Promise<{ success: boolean; message: string }> => {
  if (isConnected) {
    return { success: true, message: 'MongoDB is already connected.' };
  }

  const mongoUri = customUri || process.env.MONGODB_URI || 'mongodb://localhost:27017/notes_management_db';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return { success: true, message: `Connected to MongoDB (${conn.connection.name})` };
  } catch (error: any) {
    isConnected = false;
    console.warn(`[MongoDB] Connection failed: ${error.message}`);
    return {
      success: false,
      message: `Could not connect to MongoDB at "${mongoUri}". Error: ${error.message}`,
    };
  }
};

export const getDBStatus = (): boolean => isConnected;

export default connectDB;

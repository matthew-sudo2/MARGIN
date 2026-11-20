import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const shouldConnect = process.env.CONNECT_DB === 'true';

  if (!shouldConnect) {
    console.log(
      '--------------------------------------------------------------------------------\n' +
      '[Database Status]: STANDALONE / IN-MEMORY MODE ACTIVE\n' +
      '[Course Note]: MongoDB connection is held as inactive per instructor guidance.\n' +
      'Mongoose Schemas & Models are fully defined and ready in server/models/.\n' +
      'All CRUD operations are actively served via fast in-memory dual-mode store.\n' +
      'To enable live MongoDB later, change CONNECT_DB=true in server/.env\n' +
      '--------------------------------------------------------------------------------'
    );
    return false;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/margin_db';

  try {
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(`[MongoDB Connected]: Host ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.warn('[Fallback]: Falling back to in-memory dual-mode store.');
    isConnected = false;
    return false;
  }
};

export const isDBConnected = () => isConnected;


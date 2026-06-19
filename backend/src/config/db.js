import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    console.log('MongoDB connected');
  } catch (err) {
    if (err.message.includes('whitelist')) {
      throw new Error(
        `${err.message} Add your IP in Atlas → Network Access → Add IP Address (or use 0.0.0.0/0 for local dev only).`
      );
    }
    throw err;
  }
}

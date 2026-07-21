const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      await mongoose.connect(uri);
      console.log('MongoDB connected');
      return;
    } catch (error) {
      console.warn('MongoDB connection failed:', error.message);
      console.warn('Falling back to in-memory MongoDB server.');
    }
  }

  memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri('ai-career-assistant');
  await mongoose.connect(memoryUri);
  console.log('MongoDB memory server connected');
};

const stopMemoryServer = async () => {
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = undefined;
  }
};

module.exports = connectDB;
module.exports.stopMemoryServer = stopMemoryServer;

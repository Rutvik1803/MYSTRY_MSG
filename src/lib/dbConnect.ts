import mongoose from 'mongoose';

type ConnectionObejct = {
  isConnected?: number;
};

const connection: ConnectionObejct = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log('Using existing connection');
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
    connection.isConnected = db.connections[0].readyState;

    console.log('New connection');
  } catch (err) {
    console.log(err, 'Database connection error');
    process.exit(1);
  }
}

export default dbConnect;

import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';

const dbConnection = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URL}/${DB_NAME}`,
    );
    console.log(
      `\n Database Connected Successfully on DB_HOST:  ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log('Database Connection Failed', error);
    process.exit(1);
  }
};

export default dbConnection;

import app from './app.js';
import dotenv from 'dotenv';
import dbConnection from './db/index.js';

dotenv.config({});

dbConnection()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`app is listening on PORT ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log('Something went wrong while connecting with server', error);
  });

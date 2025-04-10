import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// Import user routes

import Userrouter from './routes/user.routes.js';

app.use('/api/v1/users', Userrouter);

// Import Contacts routes

import contactrouter from './routes/contact.routes.js';

app.use('/api/v1/contacts', contactrouter);

export default app;

import express from 'express';
import useMiddleware from './middleware';

const app = express();

useMiddleware(app);

export default app;

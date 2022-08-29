import { Express } from 'express';
import { bodyParser } from '../middleware/bodyParser';
import { cors } from '../middleware/cors';
import { contentType } from '../middleware/contentType';

const useMiddleware = (app: Express) => {
  app.use(bodyParser);
  app.use(cors);
  app.use(contentType);
};

export default useMiddleware;

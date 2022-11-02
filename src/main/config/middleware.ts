import { Express } from 'express';
import { authBot, bodyParser, contentType, cors } from '../middleware/';

const useMiddleware = (app: Express) => {
  app.use(authBot);
  app.use(bodyParser);
  app.use(cors);
  app.use(contentType);
};

export default useMiddleware;

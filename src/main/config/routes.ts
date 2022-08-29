import fs from 'fs';
import { Express, Router } from 'express';

const useRoutes = (app: Express) => {
  const router = Router();
  app.use('/v1', router);
  fs.readdirSync('./src/main/routes').map(async (file) => {
    (await import(`../routes/${file}`)).default(router);
    console.log('router ->', file);
  });
};

export default useRoutes;

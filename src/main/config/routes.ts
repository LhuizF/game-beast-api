import fs from 'fs';
import path from 'path';
import { Express, Router } from 'express';

const useRoutes = (app: Express) => {
  const folder = path.join(__dirname, '../', './routes');
  const prefix = '/v1';
  const router = Router();

  app.use(prefix, router);
  fs.readdirSync(folder).map(async (file, i) => {
    (await import(`../routes/${file}`)).default(router);
    // console.log('router ->', file);

    if (process.env.NODE_ENV === 'production') return;

    if (i === fs.readdirSync(folder).length - 1) {
      console.log('\nAll routes');

      router.stack.forEach((r) => {
        const methods = Object.keys(r.route.methods);

        methods.forEach((m) => {
          const method = (() => {
            if (m.length <= 3) {
              return m + '  ->';
            }
            return m + ' ->';
          })();

          console.log(method.toUpperCase(), prefix + r.route.path);
        });
      });
    }
  });
};

export default useRoutes;

import { Router } from 'express';

export default (router: Router): void => {
  router.get('/status', (req, res) => res.json({ status: 'okay' }));
};

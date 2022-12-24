import { Router } from 'express';

export default (router: Router): void => {
  router.get('/status', (req, res) => {
    const origin = req.get('origin');
    console.log('origin ->', origin);
    res.json({ status: 'okay' });
  });
};

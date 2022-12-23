import { Router } from 'express';

export default (router: Router): void => {
  router.get('/status', (req, res) => {
    const origin = req.get('origin');
    console.log('DISCORD', process.env.DISCORD_TOKEN);
    res.json({ status: 'okay' });
  });
};

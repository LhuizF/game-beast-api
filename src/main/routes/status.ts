import { Router } from 'express';
import { GameTimeAdapter } from '../../utils/game-time';

export default (router: Router): void => {
  router.get('/status', (req, res) => {
    const getTime = new GameTimeAdapter();

    getTime.getNext();

    res.json({ status: 'okay' });
  });
};

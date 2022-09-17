import { Router } from 'express';
import { adapterRoute } from '../adapters/expressRoute';
import { makeLastGamesController } from '../factories/lastGames';

export default (router: Router): void => {
  router.get('/last-games', adapterRoute(makeLastGamesController()));
};

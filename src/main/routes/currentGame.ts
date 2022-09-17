import { Router } from 'express';
import { adapterRoute } from '../adapters/expressRoute';
import { makeCurrentGameController } from '../factories/currentGame';

export default (router: Router): void => {
  router.get('/game', adapterRoute(makeCurrentGameController()));
};

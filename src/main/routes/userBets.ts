import { Router } from 'express';
import { adapterRoute } from '../adapters/expressRoute';
import { makeUserBetsController } from '../factories/userBets';

export default (router: Router): void => {
  router.get('/user/:id_guild/:id_discord/bets', adapterRoute(makeUserBetsController()));
};

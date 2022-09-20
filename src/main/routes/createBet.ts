import { Router } from 'express';
import { adapterRoute } from '../adapters/expressRoute';
import { makeCreateBet } from '../factories/createBet';

export default (router: Router): void => {
  router.post('/bet/:guild_id/:id_discord', adapterRoute(makeCreateBet()));
};

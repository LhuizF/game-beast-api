import { Router } from 'express';
import { adapterRoute } from '../adapters/expressRoute';
import { makeUserBetsController } from '../factories/userBets';
import { authBot } from '../middleware';

export default (router: Router): void => {
  router.get(
    '/guild/:id_guild/user/:id_discord/bets',
    authBot,
    adapterRoute(makeUserBetsController())
  );
};

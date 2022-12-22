import { Router } from 'express';
import { adapterRoute } from '../adapters/expressRoute';
import { makeCreateGuildController } from '../factories/createGuild';
import { authBot } from '../middleware';

export default (router: Router): void => {
  router.post('/create-guild', authBot, adapterRoute(makeCreateGuildController()));
};

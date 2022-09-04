import { Router } from 'express';
import { adapterRoute } from '../adapters/expressRoute';
import { makeCreateGuildController } from '../factories/createGuild';

export default (router: Router): void => {
  router.post('/create-guild', adapterRoute(makeCreateGuildController()));
};

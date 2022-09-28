import { Router } from 'express';
import { adapterRoute } from '../adapters/expressRoute';
import { makeUserController } from '../factories/user';

export default (router: Router): void => {
  router.get('/guild/:id_guild/user/:id_discord', adapterRoute(makeUserController()));
};

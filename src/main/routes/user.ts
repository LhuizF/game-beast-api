import { Router } from 'express';
import { adapterRoute } from '../adapters/expressRoute';
import { makeUserController } from '../factories/user';

export default (router: Router): void => {
  router.get('/user/:id_guild/:id_discord', adapterRoute(makeUserController()));
};

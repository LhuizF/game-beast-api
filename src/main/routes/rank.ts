import { Router } from 'express';
import { adapterRoute } from '../adapters/expressRoute';
import { makeRank } from '../factories/rank';

export default (router: Router): void => {
  router.get('/rank', adapterRoute(makeRank()));
};

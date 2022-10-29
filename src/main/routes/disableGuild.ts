import { Router } from 'express';
import { adapterRoute } from '../adapters/expressRoute';
import { makeDisableGuild } from '../factories/disableGuild';

export default (router: Router): void => {
  router.put('/disable-guild/:guild', adapterRoute(makeDisableGuild()));
};

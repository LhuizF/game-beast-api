import { Router } from 'express';
import { adapterRoute } from '../adapters/expressRoute';
import { makeDisableGuild } from '../factories/disableGuild';
import { authBot } from '../middleware';

export default (router: Router): void => {
  router.put('/disable-guild/:guild', authBot, adapterRoute(makeDisableGuild()));
};

import { Router } from 'express';
import { adapterRoute } from '../adapters/expressRoute';
import { makeSignUpController } from '../factories/signup';

export default (router: Router): void => {
  router.post('/singup', adapterRoute(makeSignUpController()));
};

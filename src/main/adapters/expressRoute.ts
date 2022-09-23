import { Request, Response } from 'express';
import { Controller, HttpRequest } from '../../presentation/protocols';

export const adapterRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    console.log(req.method, '->', req.originalUrl);

    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      query: req.query
    };

    const { statusCode, body } = await controller.handle(httpRequest);
    res.status(statusCode).json(body);
  };
};

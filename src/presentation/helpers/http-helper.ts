import { ErrorMessage, ServerError } from '../erros';
import { HttpResponse } from '../protocols/http';

export const badRequest = (error: string, data?: any): HttpResponse => ({
  statusCode: 400,
  body: new ErrorMessage(error, data)
});

export const serverError = (error: any): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error)
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
});

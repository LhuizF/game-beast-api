import { HelperDb } from '../../../data/protocols/helperDb';
import { MissingParamError, InvalidParamError } from '../../erros';
import { badRequest, ok, serverError } from '../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class UserController implements Controller {
  constructor(private readonly helperDb: HelperDb) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id_user } = httpRequest.params;

      if (!id_user) {
        return badRequest(new MissingParamError('id_user'));
      }

      const user = await this.helperDb.getUser(id_user);

      if (!user) {
        return badRequest(new InvalidParamError('id_user'));
      }

      return ok(user);
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}

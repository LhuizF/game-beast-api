import { HelperDb } from '../../../data/protocols';
import { badRequest, ok, serverError } from '../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class UserController implements Controller {
  constructor(private readonly helperDb: HelperDb) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id_guild, id_discord } = httpRequest.params;
      const fields = ['id_guild', 'id_discord'];

      for (const field of fields) {
        if (!httpRequest.params[field]) {
          return badRequest(`${field} is required`);
        }
      }

      const user = await this.helperDb.getUserDiscord(id_guild, id_discord);

      if (!user) {
        return badRequest('user not found');
      }

      return ok(user);
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}

import { UserInfos } from '../../../data/protocols';
import { badRequest, ok, serverError } from '../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class UserBetsController implements Controller {
  constructor(private readonly userInfos: UserInfos) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const max = Number(httpRequest.query?.max) || 3;
      const { id_guild, id_discord } = httpRequest.params;

      const fields = ['id_guild', 'id_discord'];

      for (const field of fields) {
        if (!httpRequest.params[field]) {
          return badRequest(`${field} is required`);
        }
      }

      const bets = await this.userInfos.getLastBets(id_guild, id_discord, max);

      return ok(bets);
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}

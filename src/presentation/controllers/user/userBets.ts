import { UserInfos } from '../../../data/protocols/userInfos';
import { MissingParamError } from '../../erros';
import { badRequest, ok, serverError } from '../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class UserBetsController implements Controller {
  constructor(private readonly userInfos: UserInfos) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id_user } = httpRequest.params;

      if (!id_user) {
        return badRequest(new MissingParamError('id_user'));
      }

      const bets = await this.userInfos.getLastThreeBets(id_user);

      return ok(bets);
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}

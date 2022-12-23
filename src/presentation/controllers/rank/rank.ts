import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { HelperDb } from '../../../data/protocols';
import { ok, serverError } from '../../helpers';

export class RankController implements Controller {
  constructor(private readonly helperDb: HelperDb) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const serverId = httpRequest.query?.server;

      const rank = await this.helperDb.getRank(serverId);

      return ok(rank);
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}

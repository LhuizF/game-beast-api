import { HelperDb } from '../../../data/protocols/helperDb';
import { ok, serverError } from '../../helpers';
import { Controller, HttpResponse } from '../../protocols';

export class LastGamesController implements Controller {
  constructor(private readonly helperDb: HelperDb) {}
  async handle(): Promise<HttpResponse> {
    try {
      const games = await this.helperDb.getLastThreeGames();

      return ok(games);
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}

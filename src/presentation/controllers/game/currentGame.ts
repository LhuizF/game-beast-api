import { HelperDb } from '../../../data/protocols';
import { badRequest, ok, serverError } from '../../helpers';
import { Controller, HttpResponse } from '../../protocols';

export class CurrentGameController implements Controller {
  constructor(private readonly helperDb: HelperDb) {}
  async handle(): Promise<HttpResponse> {
    try {
      const game = await this.helperDb.getCurrentGame();

      if (!game) {
        return badRequest('game not found');
      }

      return ok(game);
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}

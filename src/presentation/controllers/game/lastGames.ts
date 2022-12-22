import { HelperDb } from '../../../data/protocols/helperDb';
import { BeastModel, GameModel } from '../../../domain/models';
import { ok, serverError } from '../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { GameResult } from '../../protocols/play-result';

export class LastGamesController implements Controller {
  constructor(private readonly helperDb: HelperDb) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const max = Number(httpRequest.query?.max) || 3;

      const games = await this.helperDb.getLastGames(max);

      const gameResult: Array<GameResult> = await Promise.all(
        games.map(async (game) => {
          const beastWin = (await this.helperDb.getBeast(game.result)) as BeastModel;
          const { winners, losers } = await this.helperDb.getBetsByGame(game.id);

          const currentGame: GameModel = {
            id: game.id,
            result: game.result,
            time: game.time,
            created_at: game.created_at,
            update_at: game.update_at
          };

          return {
            game: currentGame,
            totalBets: game.bets.length,
            beastWin,
            winners,
            losers
          };
        })
      );

      return ok(gameResult);
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}

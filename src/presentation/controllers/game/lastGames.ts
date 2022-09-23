import { HelperDb } from '../../../data/protocols/helperDb';
import { ok, serverError } from '../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { GameResult } from '../../protocols/play-result';

export class LastGamesController implements Controller {
  constructor(private readonly helperDb: HelperDb) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const max = Number(httpRequest.query?.max) || 3;

      const games = await this.helperDb.getLastGames(max);

      const gamesWithBests: GameResult[] = await Promise.all(
        games.map(async (game) => {
          const beastWin = await this.helperDb.getBeast(game.id);

          const { winners, losers } = await this.helperDb.getBetsByGame(game.id);

          return {
            id_game: game.id,
            totalBets: game.bets.length,
            beastWin,
            winners,
            losers,
            create_at: game.created_at,
            date: game.update_at
          };
        })
      );

      return ok(gamesWithBests);
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}

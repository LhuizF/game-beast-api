import { HelperDb } from '../../../data/protocols/helperDb';
import { PlaceBet } from '../../../domain/usecases/place-bet';
import { badRequest, ok, serverError } from '../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

class CreateBetController implements Controller {
  constructor(private readonly placeBet: PlaceBet, private readonly helperDb: HelperDb) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const RequiredFields = ['id_beast', 'points', 'platform', 'id_guild', 'id_discord'];

      for (const field of RequiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(`${field} is required`);
        }
      }

      const { id_beast, points, platform, id_guild, id_discord } = httpRequest.body;

      const beast = await this.helperDb.getBeast(id_beast);
      if (!beast) {
        return badRequest('beast not found');
      }

      const user = await this.helperDb.getUserDiscord(id_guild, id_discord);
      if (!user) {
        return badRequest('user not found');
      }

      const id_game = await this.helperDb.getCurrentGameId();
      if (!id_game) {
        return badRequest('game not found');
      }

      if (user.points < points) {
        return badRequest('insufficient points', { userPoints: user.points });
      }

      const bet = await this.placeBet.play({
        id_user: user.id,
        id_beast,
        points,
        platform,
        id_game
      });

      return ok({
        id: bet.id,
        id_user: user.id,
        beast: beast.name,
        id_game,
        status: bet.status,
        points
      });
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}

export default CreateBetController;

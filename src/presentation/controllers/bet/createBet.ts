import { HelperDb } from '../../../data/protocols/helperDb';
import { PlaceBet } from '../../../domain/usecases/place-bet';
import { InvalidParamError, MissingParamError } from '../../erros';
import { badRequest, ok, serverError } from '../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

class CreateBetController implements Controller {
  constructor(private readonly placeBet: PlaceBet, private readonly helperDb: HelperDb) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const RequiredFields = ['id_user', 'id_beast', 'points', 'platform'];

      for (const field of RequiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { id_user, id_beast, points, platform } = httpRequest.body;

      const beast = await this.helperDb.getBeast(id_beast);
      const user = await this.helperDb.getUser(id_user);

      if (!beast) {
        return badRequest(new InvalidParamError('beast not found'));
      }

      if (!user) {
        return badRequest(new InvalidParamError('user not found'));
      }

      if (user.points < points) {
        return badRequest(new InvalidParamError('insufficient points'));
      }

      const bet = await this.placeBet.play({ id_user, id_beast, points, platform });

      return ok(bet);
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}

export default CreateBetController;

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

      await this.helperDb.verifyBeast(id_beast);
      const user = await this.helperDb.verifyUser(id_user);

      if (user.points < points) {
        return badRequest(new InvalidParamError('insufficient points'));
      }

      const bet = await this.placeBet.play({ id_user, id_beast, points, platform });

      return ok(bet);
    } catch (error) {
      return serverError(error);
    }
  }
}

export default CreateBetController;

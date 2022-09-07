import { PlaceBet } from '../../../domain/usecases/place-bet';
import { MissingParamError } from '../../erros';
import { badRequest, ok, serverError } from '../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

class CreateBetController implements Controller {
  constructor(private readonly placeBet: PlaceBet) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const RequiredFields = ['id_user', 'id_beast', 'points', 'platform'];

      for (const field of RequiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { id_user, id_beast, points, platform } = httpRequest.body;

      const bet = await this.placeBet.play({ id_user, id_beast, points, platform });

      return ok(bet);
    } catch (error) {
      return serverError(error);
    }
  }
}

export default CreateBetController;

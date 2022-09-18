import { AddGuild } from '../../../domain/usecases/add-guild';
import { MissingParamError } from '../../erros';
import { badRequest, ok, serverError } from '../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

class CreateGuildController implements Controller {
  constructor(private readonly addGuild: AddGuild) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const fields = ['id', 'channel'];

      for (const field of fields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { id, name, channel } = httpRequest.body;

      if (!name) return badRequest(new MissingParamError('name'));

      const icon =
        httpRequest.body.icon ||
        'https://cdn-icons-png.flaticon.com/512/5968/5968756.png';

      const guild = await this.addGuild.add({
        id,
        name,
        icon,
        channel
      });
      return ok(guild);
    } catch (error) {
      return serverError(error);
    }
  }
}

export default CreateGuildController;

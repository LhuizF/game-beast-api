import { AddGuild } from '../../../domain/usecases/add-guild';
import { badRequest, ok, serverError } from '../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

class CreateGuildController implements Controller {
  constructor(private readonly addGuild: AddGuild) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const fields = ['id', 'channel', 'name'];

      for (const field of fields) {
        if (!httpRequest.body[field]) {
          return badRequest(`${field} is required`);
        }
      }
      const { id, name, channel } = httpRequest.body;

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

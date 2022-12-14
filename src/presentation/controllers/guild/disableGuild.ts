import { DisableGuild } from '../../../data/protocols';
import { badRequest, ok, serverError } from '../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

class DisableGuildController implements Controller {
  constructor(private readonly disableGuild: DisableGuild) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const guildId = httpRequest.params?.guild as string;

      if (!guildId) {
        return badRequest(`id_guild is required`);
      }

      const guild = await this.disableGuild.disable(guildId);

      if (!guild) return badRequest(`Guild ${guildId} not found`);

      return ok({ message: `Guild ${guildId} disabled` });
    } catch (error) {
      return serverError(error);
    }
  }
}

export default DisableGuildController;

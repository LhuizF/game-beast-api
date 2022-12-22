import { HttpRequest, HttpResponse, EmailValidator, AddUser } from './signup-protocols';
import { badRequest, serverError, ok } from '../../helpers';
import { Controller } from '../../protocols/controller';
import { HelperDb } from '../../../data/protocols/helperDb';

class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addUser: AddUser,
    private readonly helperDb: HelperDb
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, id_guild, email, id_discord } = httpRequest.body;

      if (!name) {
        return badRequest('name is required');
      }

      if (!id_guild && !email) {
        return badRequest('id_guild or email is required');
      }

      const existsUser = await this.helperDb.checkUser(id_guild, id_discord, email);
      if (existsUser) {
        return badRequest('user already registered');
      }

      if (id_guild) {
        if (!id_discord) {
          return badRequest('id_discord is required');
        }

        const guild = await this.helperDb.getGuild(id_guild);
        if (!guild) {
          return badRequest('guild not found');
        }
      }

      if (email) {
        const isValid = this.emailValidator.isValid(email);

        if (!isValid) {
          return badRequest('email not valid');
        }

        const passwords = ['password', 'password_confirmation'];
        for (const password of passwords) {
          if (!httpRequest.body[password]) {
            return badRequest(`${password} is required`);
          }
        }
        const { password, password_confirmation } = httpRequest.body;

        if (password !== password_confirmation) {
          return badRequest('password_confirmation not valid');
        }
      }
      //trocar depois hehehe
      const urlAvatar =
        httpRequest.body.avatar ||
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

      const user = await this.addUser.add({
        name,
        id_guild,
        id_discord,
        email,
        password: httpRequest.body.password,
        avatar: urlAvatar
      });

      return ok(user);
    } catch (error) {
      return serverError(error);
    }
  }
}

export default SignUpController;

import { HttpRequest, HttpResponse, EmailValidator, AddUser } from './signup-protocols';
import { InvalidParamError, MissingParamError } from '../../erros';
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
        return badRequest(new MissingParamError('name'));
      }

      if (!id_guild && !email) {
        return badRequest(new MissingParamError('id_guild or email'));
      }

      if (id_guild) {
        if (!id_discord) {
          return badRequest(new MissingParamError('id_discord'));
        }

        const guild = await this.helperDb.getGuild(id_guild);
        if (!guild) {
          return badRequest(new InvalidParamError('guild not found'));
        }
      }

      if (email) {
        const isValid = this.emailValidator.isValid(email);

        if (!isValid) {
          return badRequest(new InvalidParamError('email'));
        }

        const passwords = ['password', 'password_confirmation'];
        for (const password of passwords) {
          if (!httpRequest.body[password]) {
            return badRequest(new MissingParamError(password));
          }
        }
        const { password, password_confirmation } = httpRequest.body;

        if (password !== password_confirmation) {
          return badRequest(new InvalidParamError('password_confirmation'));
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

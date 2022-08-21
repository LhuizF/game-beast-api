import { HttpRequest, HttpResponse, EmailValidator, AddUser } from './signup-protocols';
import { InvalidParamError, MissingParamError } from '../../erros';
import { badRequest, serverError } from '../../helpers';
import { Controller } from '../../protocols/controller';

class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addUser: AddUser
  ) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const { name, id_guild, email, id_discord } = httpRequest.body;



      

      if (!name) {
        return badRequest(new MissingParamError('name'));
      }

      if (!id_guild && !email) {
        return badRequest(new MissingParamError('id_guild or email'));
      }

      if (id_guild && !id_discord) {
        return badRequest(new MissingParamError('id_discord'));
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

      const user = this.addUser.add({
        name,
        id_guild,
        id_discord,
        email,
        password: httpRequest.body.password,
        avatar: httpRequest.body.avatar
      });

      return {
        statusCode: 200,
        body: 'success'
      };
    } catch (error) {
      return serverError();
    }
  }
}

export default SignUpController;

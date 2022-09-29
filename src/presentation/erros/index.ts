// export class InvalidParamError extends Error {
//   constructor(public paramName: string) {
//     super(`Invalid param: ${paramName}`);
//     this.name = 'InvalidParamError';
//   }
// }

// export class MissingParamError extends Error {
//   constructor(public paramName: string) {
//     super(`Missing param: ${paramName}`);
//     this.name = 'MissingParamError';
//   }
// }

export class ServerError extends Error {
  private readonly error: string;
  constructor(error: any) {
    super('Internal server error');
    this.name = 'ServerError';
    this.error = JSON.stringify(error);
  }
}

export class ErrorMessage {
  constructor(private readonly mensagem: string, private readonly data?: any) {}
}

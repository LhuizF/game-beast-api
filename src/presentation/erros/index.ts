export class InvalidParamError extends Error {
  constructor(public paramName: string) {
    super(`Invalid param: ${paramName}`);
    this.name = 'InvalidParamError';
  }
}

export class MissingParamError extends Error {
  constructor(public paramName: string) {
    super(`Missing param: ${paramName}`);
    this.name = 'MissingParamError';
  }
}

export class ServerError extends Error {
  constructor() {
    super('Internal server error');
    this.name = 'ServerError';
  }
}

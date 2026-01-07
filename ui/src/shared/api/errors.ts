export class DigestError extends Error {
  digest: string | undefined;

  constructor(message: string, digest: string) {
    super(message);
    this.digest = digest;
  }
}

export class HTTPError extends Error {
  httpCode: number | undefined;

  constructor(message: string, options: { code: number }) {
    super(message);
    this.httpCode = options.code;
  }
}

export class NestError extends Error {
  httpCode: number | undefined;

  constructor(message: string, options: { code: number }) {
    super(message);
    this.httpCode = options.code;
  }
}

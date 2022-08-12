export class CustomException extends Error {
  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message);
  }
}

export class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public log(
    message: any,
    context: string = "LOG"
  ): void {
    console.log(
      new Date().toISOString(),
      `[${context}]`,
      message
    );
  }

  public error(
    error: any,
    context: string = "ERROR"
  ): void {
    console.error(
      new Date().toISOString(),
      `[${context}]`,
      error
    );
  }
}

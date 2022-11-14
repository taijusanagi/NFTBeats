import { env } from "../../config/env";

export class Logger {
  debug(...message: unknown[]) {
    if (env.isDebugLogEnabled) {
      console.log(...message);
    }
  }

  info(...message: unknown[]) {
    console.log(...message);
  }

  error(...message: unknown[]) {
    console.error(...message);
  }
}

export const logger = new Logger();

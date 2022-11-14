import { env } from "../../config/env";

export class Logger {
  debug(...message: unknown[]) {
    if (env.isDebugLogEnabled) {
      console.log("debug", message);
    }
  }

  error(...message: unknown[]) {
    console.log("error", message);
  }
}

export const logger = new Logger();

import pino from "pino";

import { env } from "../../config/env";

const _logger = pino();

export class Logger {
  debug(...message: unknown[]) {
    if (env.isDebugLogEnabled) {
      _logger.debug(message);
    }
  }

  info(...message: unknown[]) {
    _logger.info(message);
  }

  error(...message: unknown[]) {
    _logger.error(message);
  }
}

export const logger = new Logger();

import { Injectable } from '@angular/core';
import { logLevels } from '../enums/log';

@Injectable({
  providedIn: 'root'
})

export class LoggingService {
  currentLogLevel = 0;
  constructor() {
    // If loggingLevel is null or undefined then we do have to pick it from Configuration service.
    // eslint-disable-next-line no-empty
    if (!this.currentLogLevel) {

    }
  }

  public silly(msg: string): void {
    this.checkLogLevelAndLog(logLevels.silly, msg);
  }

  public debug(msg: string): void {
    this.checkLogLevelAndLog(logLevels.debug, msg);
  }

  public info(msg: string): void {
    this.checkLogLevelAndLog(logLevels.info, msg);

  }

  public warn(msg: string): void {
    this.checkLogLevelAndLog(logLevels.warn, msg);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public error(msg: string, err: Function): void {
    const error = `${msg}, ${err}`;
    this.checkLogLevelAndLog(logLevels.error, error);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private log(msg: string) {
    // eslint-disable-next-line no-console
    console.log(`${msg}`);
  }

  private checkLogLevelAndLog(index: number, msg: string) {
    if (this.currentLogLevel <= index) {
      this.log(msg);
    }
  }
}

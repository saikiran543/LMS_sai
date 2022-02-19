import { TestBed } from '@angular/core/testing';

import { LoggingService } from './logging.service';
import { logLevels } from '../enums/log';

// eslint-disable-next-line max-lines-per-function
describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('silly', () => {
    service.currentLogLevel = logLevels.silly;
    const called = spyOn(console, 'log');
    service.silly('debugTesting');
    expect(called).toHaveBeenCalledWith('debugTesting');
  });

  it('debug', () => {
    service.currentLogLevel = logLevels.debug;
    const called = spyOn(console, 'log');
    service.debug('debugTesting');
    expect(called).toHaveBeenCalledWith('debugTesting');
  });

  it('debugFails', () => {
    service.currentLogLevel = logLevels.error;
    const called = spyOn(console, 'log');
    service.debug('debugTesting');
    expect(called).not.toHaveBeenCalledWith('debugTesting');
  });

  it('info', () => {
    service.currentLogLevel = logLevels.info;
    const called = spyOn(console, 'log');
    service.info('debugTesting');
    expect(called).toHaveBeenCalledWith('debugTesting');
  });

  it('warn', () => {
    service.currentLogLevel = logLevels.warn;
    const called = spyOn(console, 'log');
    service.warn('debugTesting');
    expect(called).toHaveBeenCalledWith('debugTesting');
  });

  it('error', () => {

    const foo = function () {
      return true;
    };
    const output = `debugTesting, ${foo}`;

    service.currentLogLevel = logLevels.error;
    const called = spyOn(console, 'log');
    service.error('debugTesting', foo);
    expect(called).toHaveBeenCalledWith(output);
  });

});

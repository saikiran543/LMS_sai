import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import translations from '../../assets/i18n/en.json';
import { TimesAgoPipe } from './times-ago.pipe';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

describe('TimesAgoPipe', () => {
  let translationService: TranslateService;
  let injector: Injector;
  let pipe: TimesAgoPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader,
          }
        })
      ],
      providers: [ChangeDetectorRef]
    });
    translationService = TestBed.inject(TranslateService);
    injector = TestBed.inject(Injector);
    pipe = new TimesAgoPipe(translationService, injector);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the translation key and date time context for the date time', () => {
    const date = new Date();
    let returnValue = pipe['prepareDateTimeContext'](date);
    expect(returnValue).toEqual({
      dateTimeContext: 1,
      translationKey: 'timesAgoPipe.minuteAgo',
    });

    date.setHours(date.getHours() - 1);
    returnValue = pipe['prepareDateTimeContext'](date);
    expect(returnValue).toEqual({
      dateTimeContext: 1,
      translationKey: 'timesAgoPipe.hourAgo',
    });
  });

  it('should return the translated content for the confuration', async () => {
    const date = new Date();
    const res = pipe.transform(date);
    expect(res).toBe('timesAgoPipe.minuteAgo');
  });
});

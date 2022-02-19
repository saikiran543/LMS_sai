import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Injector, NgModule, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 *
 *
 * @export
 * @class TimesAgoPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'timesAgo',
})
export class TimesAgoPipe implements PipeTransform {
  /**
   *
   *
   * @private
   * @type {AsyncPipe}
   * @memberof TimesAgoPipe
   */
  private asyncPipe: AsyncPipe;

  /**
   * Creates an instance of TimesAgoPipe.
   * @memberof TimesAgoPipe
   */
  constructor(private translationService: TranslateService, injector: Injector) {
    this.asyncPipe = new AsyncPipe(injector.get(ChangeDetectorRef));
  }

  /**
   *
   *
   * @private
   * @param {Date} date
   * @return {*}  {{
   *     translationKey: string;
   *     dateTimeContext: number;
   *   }}
   * @memberof TimesAgoPipe
   */
  private prepareDateTimeContext(date: Date): {
    translationKey: string;
    dateTimeContext: number;
  } {
    const milisecondDifference: number = new Date().getTime() - date.getTime();
    const seconds = Math.floor(milisecondDifference / 1000);
    let intervalType;

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      intervalType = 'year';
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = 'day';
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = 'hour';
        } else {
          interval = Math.floor(seconds / 60);
          if(interval < 1) {
            interval = 1;
          }
          intervalType = 'minute';
        }
      }
    }

    if (interval > 1 || interval === 0) {
      intervalType += 's';
    }

    const translationKey = 'timesAgoPipe.' + intervalType + 'Ago';
    return {
      translationKey,
      dateTimeContext: interval,
    };
  }

  /**
   *
   *
   * @param {Date} date
   * @return {*}  {string}
   * @memberof TimesAgoPipe
   */
  public transform(date: Date | string): string {
    const dateInDateFormat = new Date(date);
    const { translationKey, dateTimeContext } = this.prepareDateTimeContext(dateInDateFormat);
    const translationObservable = this.translationService
      .get(translationKey, { dateTimeContext });
    return this.asyncPipe.transform(translationObservable);
  }

  /**
   *
   *
   * @memberof TimesAgoPipe
   */
  ngOnDestroy(): void {
    this.asyncPipe.ngOnDestroy();
  }
}

@NgModule({declarations: [ TimesAgoPipe ],exports: [ TimesAgoPipe ]}) export class TimesAgoPipeModule {}


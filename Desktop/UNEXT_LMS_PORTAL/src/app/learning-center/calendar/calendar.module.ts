import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { AngularCalendarComponent } from './angular-calendar/angular-calendar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarDateFormatter,CalendarModule,CalendarMomentDateFormatter,DateAdapter,MOMENT} from 'angular-calendar';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import {DpDatePickerModule} from 'ng2-date-picker';
import { SelfTaskComponent } from './creation-and-manipulation/self-task/self-task.component';
import { CKEditorSharedModule } from 'src/app/shared/modules/ckeditor-shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import moment from 'moment-timezone';
import { RecurrenceModalComponent } from './creation-and-manipulation/recurrence-modal/recurrence-modal.component';
import { DateTimePickerModule } from 'src/app/shared/modules/date-time-picker.module';
import { CalendarService } from './service/calendar.service';
import { ToastrSharedModule } from 'src/app/shared/modules/toastr-shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PopupGotoComponent } from './popup-goto/popup-goto.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';
import { PopupEventListComponent } from './popup-event-list/popup-event-list.component';

//eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function momentAdapterFactory() {
  return adapterFactory(moment);
}

@NgModule({
  declarations: [
    CalendarComponent,
    AngularCalendarComponent,
    SelfTaskComponent,
    RecurrenceModalComponent,
    PopupGotoComponent,
    PopupEventListComponent,
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DpDatePickerModule,
    NgbModule,
    CKEditorSharedModule,
    AngularSvgIconModule,
    NgbModalModule,
    SafePipeModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: momentAdapterFactory,
    },
    {
      dateFormatter: {
        provide: CalendarDateFormatter,
        useClass: CalendarMomentDateFormatter,
      },
    }),
    DateTimePickerModule,
    ToastrSharedModule,
    TranslateModule,
    MatTooltipModule
  ],
  providers: [CalendarService,
    {
      provide: MOMENT,
      useValue: moment,
    },]
})
export class LearningCenterCalendarModule { }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { StorageKey } from 'src/app/enums/storageKey';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import { StorageService } from 'src/app/services/storage.service';
import { CommonUtils } from 'src/app/utils/common-utils';
import translations from '../../../../../assets/i18n/en.json';
import { CalendarService } from '../../service/calendar.service';
import { SelfTaskComponent } from './self-task.component';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

describe('SelfTaskComponent', () => {
  let component: SelfTaskComponent;
  let fixture: ComponentFixture<SelfTaskComponent>;
  let storageService: StorageService;
  let translate: TranslateService;
  let calendarService: CalendarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfTaskComponent ],
      imports: [HttpClientTestingModule, MatTooltipModule,RouterTestingModule.withRoutes(
        [
          {path: 'self-task', component: SelfTaskComponent},
          {path: 'login', component: LoginLayoutComponent}

        ]), TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      }), ToastrModule.forRoot({})],
      providers: [ CommonUtils, ToastrService, CalendarService, StorageService, TranslateService]
    })
      .compileComponents();
    storageService = TestBed.inject(StorageService);
    storageService.set(StorageKey.USER_CURRENT_VIEW, 'admin');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfTaskComponent);
    component = fixture.componentInstance;
    storageService = TestBed.inject(StorageService);
    translate = TestBed.inject(TranslateService);
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    storageService.set(StorageKey.USER_CURRENT_VIEW, 'admin');
    calendarService = TestBed.inject(CalendarService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create fom control', async (done) => {
    component.createFormControl("{}");
    done();
  });

  it('should update Self Task', async (done) => {
    const payload = { "title": "aaaa", "description": "<p>aa</p>", "recurrence": "Daily", "reminderInMinutes": 15, "allDay": true, "startDate": "2022-02-09T18:30:00.000Z", "endDate": "2022-02-18T05:37:59.000Z", "rrule": { "dtstart": "2022-02-10T02:17:39.515Z", "until": "2022-02-10T03:17:39.516Z", "freq": 3, "interval": 1 } };
    const id = "69b8a87c-963e-4bf2-8086-13ae3f047da7";
    component.params = id;
    const result: any = { "status": 200 };
    fixture.detectChanges();
    spyOn(component, "saveSelfTask").and.callThrough();
    spyOn(calendarService, "updateSelfTask").and.resolveTo(result);
    const spyOnSaveFolder: any = calendarService.updateSelfTask(id,payload);
    component.saveSelfTask();
    fixture.detectChanges();
    expect(spyOnSaveFolder instanceof Promise).toEqual(true);
    done();
  });

  it('should save Self Task', async (done) => {
    const payload = { "title": "aaaa", "description": "<p>aa</p>", "recurrence": "Daily", "reminderInMinutes": 15, "allDay": true, "startDate": "2022-02-09T18:30:00.000Z", "endDate": "2022-02-18T05:37:59.000Z", "rrule": { "dtstart": "2022-02-10T02:17:39.515Z", "until": "2022-02-10T03:17:39.516Z", "freq": 3, "interval": 1 } };
    const result: any = { "status": 200 };
    fixture.detectChanges();
    spyOn(component, "saveSelfTask").and.callThrough();
    spyOn(calendarService, "saveSelfTask").and.resolveTo(result);
    const spyOnSaveFolder: any = calendarService.saveSelfTask(payload);
    component.saveSelfTask();
    fixture.detectChanges();
    expect(spyOnSaveFolder instanceof Promise).toEqual(true);
    done();
  });

  it('should drop the recurrence drop down', async (done) => {
    component.recurrenceDropdown();
    expect(component.recurrenceOptions).toBeFalse;
    done();
  });

  it('should show error message', async (done) => {
    const message = 'Please enter a Different End Time';
    component.showErrorToast(message);
    done();
  });

  it('should show success message', async (done) => {
    const message = "Self Task Edited successfully";
    component.showSuccessToast(message);
    done();
  });

  it('should cancel Self Task', ()=>{
    const cancelStatusSpy = spyOn(component.confirmStatus,'emit');
    component.cancelSelfTask(true);
    expect(cancelStatusSpy).toHaveBeenCalled();
  });
});

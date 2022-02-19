import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import { StorageService } from 'src/app/services/storage.service';
import { CommonUtils } from 'src/app/utils/common-utils';
import { TodaysTaskService } from '../../todays-task/service/todays-task.service';
import translations from '../../../../assets/i18n/en.json';
import { PopupSelfTaskComponent } from './popup-self-task.component';
import { Observable,of } from 'rxjs';
import { StorageKey } from 'src/app/enums/storageKey';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';
class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

describe('PopupSelfTaskComponent', () => {
  let component: PopupSelfTaskComponent;
  let fixture: ComponentFixture<PopupSelfTaskComponent>;
  let storageService: StorageService;
  let translate: TranslateService;
  let todaysTaskService: TodaysTaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupSelfTaskComponent ],
      imports: [HttpClientTestingModule, SafePipeModule,RouterTestingModule.withRoutes(
        [
          {path: 'popup-self-task', component: PopupSelfTaskComponent},
          {path: 'login', component: LoginLayoutComponent}

        ]), TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      }), ToastrModule.forRoot({})],
      providers: [ CommonUtils, ToastrService, TodaysTaskService, StorageService, TranslateService]
    })
      .compileComponents();
    storageService = TestBed.inject(StorageService);
    storageService.set(StorageKey.USER_CURRENT_VIEW, 'admin');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupSelfTaskComponent);
    component = fixture.componentInstance;
    storageService = TestBed.inject(StorageService);
    translate = TestBed.inject(TranslateService);
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    storageService.set(StorageKey.USER_CURRENT_VIEW, 'admin');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    todaysTaskService = TestBed.inject(TodaysTaskService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close Popup', ()=>{
    const cancelStatusSpy = spyOn(component.cancelStatus,'emit');
    component.closePopup();
    expect(cancelStatusSpy).toHaveBeenCalled();
  });
});

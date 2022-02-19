import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Observable,of } from 'rxjs';
import { StorageKey } from 'src/app/enums/storageKey';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import { CKEditorSharedModule } from 'src/app/shared/modules/ckeditor-shared.module';
import { CommonUtils } from 'src/app/utils/common-utils';
import translations from 'src/assets/i18n/en.json';
import { LearningOutcomeListViewComponent } from '../../learning-outcome-list-view/learning-outcome-list-view.component';
import { LearningOutcomeService } from '../../service/learning-outcome.service';
import { LearningOutcomeModelComponent } from './learning-outcome-model.component';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}
// eslint-disable-next-line max-lines-per-function
describe('LearningOutcomeModelComponent', () => {
  let component: LearningOutcomeModelComponent;
  let fixture: ComponentFixture<LearningOutcomeModelComponent>;
  let storageService: StorageService;
  let translate: TranslateService;
  let routeOperationService: RouteOperationService;
  let learningOutcomeService: LearningOutcomeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule , ReactiveFormsModule, ToastrModule.forRoot(),RouterTestingModule,TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      }),CKEditorSharedModule],
      declarations: [ LearningOutcomeModelComponent,LearningOutcomeListViewComponent ],
      providers: [ConfigurationService, AuthenticationService, TranslateService,CommonUtils,ToastrService,StorageService,RouteOperationService,LearningOutcomeService]
    }).compileComponents();
    translate = TestBed.inject(TranslateService);
    storageService = TestBed.inject(StorageService);
    routeOperationService = TestBed.inject(RouteOperationService);
    learningOutcomeService = TestBed.inject(LearningOutcomeService);
    translate.use('en');
  });

  beforeEach(() => {
    storageService.set(StorageKey.USER_CURRENT_VIEW ,"admin");
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fixture = TestBed.createComponent(LearningOutcomeModelComponent);
    component = fixture.componentInstance;
    const routeParam = spyOn(routeOperationService,"listenParams");
    const paramObject ={operation: "create",courseId: "1142", parentId: "4545",id: "1454534"};
    routeParam.and.returnValue(of(paramObject));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render ui', () => {
    const compiled = fixture.debugElement.nativeElement;
    const saveButton = compiled.querySelector('.primary-btn');
    expect(saveButton.textContent).toContain('Save');
    const cancelButton = compiled.querySelector('.cancel-btn');
    expect(cancelButton.textContent).toContain('Cancel');
    const title = compiled.querySelector('input[formControlName="title"]');
    expect(title.placeholder).toContain('Enter Title');
  });

  it('Verify if the form is getting values when editing modal is clicked',async()=>{
    spyOn(learningOutcomeService,"get").and.resolveTo({_id: "61c30437471bb503681b0c7d",title: "Category 112",description: "Something"});
    component.getFormDetails("learning-category","61c30437471bb503681b0c7d");
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.outcomeForm.value.title).toEqual("Category 112");
    expect(component.outcomeForm.value.description).toEqual("Something");
  });

  it('Verify the save button is not disabled',async ()=>{
    const compiled = fixture.debugElement.nativeElement;
    const title = compiled.querySelector('input[formControlName="title"]');
    title.value = 'title123';
    title.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const saveCta = compiled.querySelector('.primary-btn');
    expect(saveCta.disabled).toBeFalse();
  });

  it('Save Button should be disabled if the value is empty/null',async ()=>{
    const compiled = fixture.debugElement.nativeElement;
    const title = compiled.querySelector('input[formControlName="title"]');
    title.value = '';
    title.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const saveCta = compiled.querySelector('.primary-btn');
    expect(saveCta.disabled).toBeTrue();
  });

  it('Character Count Checks',async ()=>{
    const compiled = fixture.debugElement.nativeElement;
    const title = compiled.querySelector('input[formControlName="title"]');
    title.value = '';
    title.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const charCount = compiled.querySelector('.char-count');
    expect(charCount.textContent).toEqual('Max of 500 Characters');
    title.value = 'abcde';
    title.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(compiled.querySelector('.char-count').textContent).toEqual('495 Character Left');
  });
});

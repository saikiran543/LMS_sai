import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RatingComponent } from './rating.component';
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { StorageKey } from 'src/app/enums/storageKey';
import { StorageService } from 'src/app/services/storage.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import translations from 'src/assets/i18n/en.json';
import { ToastrModule,ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RatingService } from './service/rating-service.service';
class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

// eslint-disable-next-line max-lines-per-function
describe('Admin Side Rating Component', () => {
  let component: RatingComponent;
  let fixture: ComponentFixture<RatingComponent>;
  let storageService: StorageService;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserAnimationsModule,ToastrModule.forRoot(),RouterTestingModule,TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      })],
      declarations: [ RatingComponent ],
      providers: [ConfigurationService, AuthenticationService, TranslateService]
    }).compileComponents();
    translate = TestBed.inject(TranslateService);
    storageService = TestBed.inject(StorageService);
    translate.use('en');
  });

  beforeEach(() => {
    storageService.set(StorageKey.USER_CURRENT_VIEW ,"admin");
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    RatingComponent.prototype.ngOnInit= ()=> {};
    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call rating overview for admin', async ()=>{
    const service = fixture.debugElement.injector.get(RatingService);
    spyOn(service,"sendToBackend").and.resolveTo({body: {totalCount: 14,overallRating: 4.1,level1: "7.1%",level2: "14.3%",level3: "7.1%",level4: "7.1%",level5: "64.3%" }});
    component.readRatings("1142","123");
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.ratings).toEqual({
      totalCount: 14,overallRating: 4.1,level1: "7.1%",level2: "14.3%",level3: "7.1%",level4: "7.1%",level5: "64.3%"
    });
  });

  it('should get all the comments for admin', async ()=>{
    const service = fixture.debugElement.injector.get(RatingService);
    spyOn(service,"sendToBackend").and.resolveTo({body: {comments: [{updatedOn: "2021-11-30T04:45:05.667Z","_id": "61a5b467d4950d2d38310b3a","level": 3,"comment": "have learnt a lot"}],"last_id": "61a5b467d4950d2d38310b49"}});
    component.readComments("1142","123");
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.comments).toEqual([{updatedOn: "2021-11-30T04:45:05.667Z","_id": "61a5b467d4950d2d38310b3a","level": 3,"comment": "have learnt a lot"}]);
    expect(component.last_id).toEqual("61a5b467d4950d2d38310b49");
  });

  it('should get more comments for admin', async ()=>{
    const service = fixture.debugElement.injector.get(RatingService);
    spyOn(service,"sendToBackend").and.resolveTo({body: {comments: [{updatedOn: "2021-12-30T04:45:05.667Z","_id": "61a5b467d4950d2d38310b49","level": 4,"comment": "Best Course on the Planet"}],"last_id": "61a5b467d4950d2d38310c90"}});
    component.comments = [{updatedOn: "2021-11-30T04:45:05.667Z","_id": "61a5b467d4950d2d38310b3a","level": 3,"comment": "have learnt a lot"}];
    component.getMoreComments("1142","123","61a5b467d4950d2d38310b3a");
    await fixture.whenStable();
    expect(component.comments).toEqual([{updatedOn: "2021-11-30T04:45:05.667Z","_id": "61a5b467d4950d2d38310b3a","level": 3,"comment": "have learnt a lot"},{updatedOn: "2021-12-30T04:45:05.667Z","_id": "61a5b467d4950d2d38310b49","level": 4,"comment": "Best Course on the Planet"}]);
    expect(component.last_id).toEqual("61a5b467d4950d2d38310c90");
  });

  it('Filter Comments to a Particular Level', async ()=>{
    const service = fixture.debugElement.injector.get(RatingService);
    spyOn(service,"sendToBackend").and.resolveTo({body: {comments: [{updatedOn: "2021-12-30T04:45:05.667Z","_id": "61a5b467d4950d2d38310b49","level": 4,"comment": "Best Course on the Planet"}],"last_id": "61a5b467d4950d2d38310c90"}});
    component.comments = [{updatedOn: "2021-11-30T04:45:05.667Z","_id": "61a5b467d4950d2d38310b3a","level": 3,"comment": "have learnt a lot"}];
    component.filterComment(4);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.comments).toEqual([{updatedOn: "2021-12-30T04:45:05.667Z","_id": "61a5b467d4950d2d38310b49","level": 4,"comment": "Best Course on the Planet"}]);
    expect(component.last_id).toEqual("61a5b467d4950d2d38310c90");
  });

  it('Check for Hiding Comment Box on Canceling', async ()=>{
    component.cancelRating();
    expect(component.showCommentBox).toBeFalse;
    expect(component.rating).toBeFalse;
  });

});

// eslint-disable-next-line max-lines-per-function
describe("Student Side Rating",()=>{
  let component: RatingComponent;
  let fixture: ComponentFixture<RatingComponent>;
  let storageService: StorageService;
  // let location: Location;
  let translate: TranslateService;
  let toastrService:ToastrService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserAnimationsModule, ToastrModule.forRoot(),RouterTestingModule,TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      })],
      declarations: [ RatingComponent ],
      providers: [ConfigurationService, AuthenticationService, TranslateService]
    }).compileComponents();
    translate = TestBed.inject(TranslateService);
    storageService = TestBed.inject(StorageService);
    toastrService = TestBed.inject(ToastrService);
    translate.use('en');
  });

  beforeEach(() => {
    storageService.set(StorageKey.USER_CURRENT_VIEW ,"student");
    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the student given rating', async ()=>{
    const service = fixture.debugElement.injector.get(RatingService);
    spyOn(service,"sendToBackend").and.resolveTo({body: [{comment: "Nice Course",updatedOn: "2021-12-30T04:45:05.667Z",level: 5}]});
    component.getStudentRating("1142","123");
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.userRating).toEqual(5);
    expect(component.userComment).toEqual({comment: "Nice Course",updatedOn: "2021-12-30T04:45:05.667Z",level: 5});
  });
  
  it('should add a rating for a content', async ()=>{
    const service = fixture.debugElement.injector.get(RatingService);
    spyOn(service,"sendToBackend").and.resolveTo({body: {comment: "Nice Course",updatedOn: "2021-12-30T04:45:05.667Z",level: 5}});
    component.addStudentRating();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(toastrService.success.call.length).toEqual(1);
    expect(component.userRating).toEqual(5);
    expect(component.userComment).toEqual({comment: "Nice Course",updatedOn: "2021-12-30T04:45:05.667Z",level: 5});
  });

  it('should edit a rating for a content', async ()=>{
    const service = fixture.debugElement.injector.get(RatingService);
    spyOn(service,"sendToBackend").and.resolveTo({body: {comment: "Could have been better",updatedOn: "2021-12-31T04:45:05.667Z",level: 4}});
    component.userComment={comment: "Nice Course",updatedOn: "2021-12-30T04:45:05.667Z",level: 5};
    component.userRating=5;
    component.editRating=true;
    component.addStudentRating();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(toastrService.success.call.length).toEqual(1);
    expect(component.userRating).toEqual(4);
    expect(component.userComment.comment).toEqual("Could have been better");
  });

});
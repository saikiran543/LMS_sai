import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DiscussionForumComponent } from './discussion-forum.component';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import { ContentService } from '../course-services/content.service';
import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import translations from '../../../assets/i18n/en.json';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

describe('DiscussionForumComponent', () => {
  let component: DiscussionForumComponent;
  let fixture: ComponentFixture<DiscussionForumComponent>;
  let contentService: ContentService;
  let routeOperationService: RouteOperationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscussionForumComponent],
      imports: [ToastrModule.forRoot(), RouterTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader, useClass: FakeLoader
        },
        defaultLanguage: 'en'
      }),
      HttpClientTestingModule,
      ],
      providers: [ContentService, RouteOperationService, StorageService]
    })
      .compileComponents();
    contentService = TestBed.inject(ContentService);
    routeOperationService = TestBed.inject(RouteOperationService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get content', () => {
    const contentServiceSpy = spyOn(contentService, 'getContentDetails').and.resolveTo();
    component.getContent("1142");
    expect(contentServiceSpy).toHaveBeenCalledOnceWith('1142', true);
  });

  it('should get content if storage service does not have course json', () => {
    const getContentSpy = spyOn(component, 'getContent').and.resolveTo();
    routeOperationService.eventQueue.next({
      params: {
        courseId: "1142",
      }
    });
    expect(getContentSpy).toHaveBeenCalledOnceWith('1142');
  });
});

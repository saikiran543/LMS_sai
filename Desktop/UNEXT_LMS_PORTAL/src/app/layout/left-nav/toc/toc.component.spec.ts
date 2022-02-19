/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { JWTService } from 'src/app/services/jwt.service';
import { LeftNavService } from 'src/app/services/left-nav.service';
import translations from '../../../../assets/i18n/en.json';
import { TocComponent } from './toc.component';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/enums/storageKey';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

describe('TocComponent', () => {
  let component: TocComponent;
  let fixture: ComponentFixture<TocComponent>;
  let storageService: StorageService;
  let leftNavService: LeftNavService;
  const allcourseContent: any = [{
    _id: "7857f006-4972-433f-9df3-9360a8164d03",
    elementMetadata: [],
    elementId: "7857f006-4972-433f-9df3-9360a8164d03",
    name: "unit003 2 1",
    createdOn: "2021-10-25T09:54:14.938Z",
    status: "unpublished",
    progress: 50,
    idealTime: 73,
    numberOfContent: 1,
    completedContent: 0,
    type: "unit",
    children: [{
      _id: "c381e874-b605-42fb-8543-893ea72d4021",
      elementMetadata: [],
      elementId: "c381e874-b605-42fb-8543-893ea72d4021",
      name: "test folder 1",
      createdOn: "2021-10-25T14:21:00.122Z",
      status: "unpublished",
      progress: 50,
      idealTime: 73,
      numberOfContent: 1,
      completedContent: 0,
      type: "folder",
      children: [],
    },{
      _id: "c381e874-b605-42fb-8543-893ea72d4022",
      elementMetadata: [],
      elementId: "c381e874-b605-42fb-8543-893ea72d4022",
      name: "test folder 1",
      createdOn: "2021-10-25T14:21:00.122Z",
      status: "unpublished",
      progress: 50,
      idealTime: 73,
      numberOfContent: 1,
      completedContent: 0,
      type: "folder",
      children: [{
        _id: "c381e874-b605-42fb-8543-893ea72d4027",
        elementMetadata: [],
        elementId: "c381e874-b605-42fb-8543-893ea72d4027",
        name: "test folder 1",
        createdOn: "2021-10-25T14:21:00.122Z",
        status: "unpublished",
        progress: 50,
        idealTime: 73,
        numberOfContent: 1,
        completedContent: 0,
        type: "folder",
        children: [],
      }],
    }]
  },
  {
    _id: "7857f006-4972-433f-9df3-9360a8164d13",
    elementMetadata: [],
    elementId: "7857f006-4972-433f-9df3-9360a8164d13",
    name: "folder 2 1",
    createdOn: "2021-10-25T09:54:14.938Z",
    status: "published",
    progress: 40,
    idealTime: 55,
    numberOfContent: 1,
    completedContent: 0,
    type: "folder",
    children: [],
  },
  {
    _id: "7857f006-4972-433f-9df3-9360a8164d13",
    elementMetadata: [],
    elementId: "7857f006-4972-433f-9df3-9360a8164d13",
    name: "folder 2 1",
    createdOn: "2021-10-25T09:54:14.938Z",
    status: "published",
    progress: 40,
    idealTime: 55,
    numberOfContent: 1,
    completedContent: 0,
    type: "folder",
    children: [],
  }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      })],
      declarations: [TocComponent],
      providers: [LeftNavService, AuthorizationService, JWTService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TocComponent);
    component = fixture.componentInstance;
    storageService = TestBed.inject(StorageService);
    fixture.detectChanges();
    leftNavService = TestBed.inject(LeftNavService);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show tooltip mouse enter', fakeAsync(async () => {
    const id: any = "12345";
    const progress = 50.52;
    spyOn(component, 'showTooltip').withArgs(id, progress).and.callThrough();
    component.idealTimeArray = [];
    component.idealTime = 0;
    component.showTooltip(id, progress);
    const buttonElement = fixture.debugElement.query(By.css('.background-highlight'));
    expect(buttonElement).toBeFalsy();
    const li = fixture.debugElement.query(By.css(".child-element"));
    component.courseContent = [{}];
    fixture.detectChanges();
    component.showTooltip(id, progress);
    expect(component.showTooltip).toHaveBeenCalled();
    const heightOfTooltip = fixture.debugElement.query(By.css('.toc-tooltip')).styles.clientHeight = "500";
    const elementPosition = fixture.debugElement.query(By.css('.child-element')).styles.offsetTop = "200";
    fixture.detectChanges();
    component.showTooltip(id, progress);
    expect(component.showTooltip).toHaveBeenCalled();
    component.courseContent = [];
    fixture.detectChanges();
    component.showTooltip(id, progress);
    expect(component.showTooltip).toHaveBeenCalled();
  }));

  it('should not show toolip active item', fakeAsync(async () => {
    const id: any = "12345";
    const progress = 50.52;
    const courseContent = [{
      _id: "7857f006-4972-433f-9df3-9360a8164d03",
      elementMetadata: [],
      elementId: "7857f006-4972-433f-9df3-9360a8164d03",
      name: "unit003 2 1",
      createdOn: "2021-10-25T09:54:14.938Z",
      status: "unpublished",
      progress: 50,
      idealTime: 73,
      numberOfContent: 1,
      completedContent: 0,
      type: "unit",
      children: []
    },
    {
      _id: "7857f006-4972-433f-9df3-9360a8164d13",
      elementMetadata: [],
      elementId: "7857f006-4972-433f-9df3-9360a8164d03",
      name: "folder 2 1",
      createdOn: "2021-10-25T09:54:14.938Z",
      status: "published",
      progress: 40,
      idealTime: 55,
      numberOfContent: 1,
      completedContent: 0,
      type: "folder",
      children: []
    }];

    spyOn(component, 'showTooltip').withArgs(id, progress).and.callThrough();
    component.idealTimeArray = [];
    component.idealTime = 0;
    component.showTooltip(id, progress);
    component.courseContent = courseContent;
    fixture.detectChanges();
    const toc: any = document.getElementById('node_7857f006-4972-433f-9df3-9360a8164d03');
    toc.classList.add("background-highlight");
    fixture.detectChanges();
    expect(component.tooltip).toBeTrue();
    const buttonElement = fixture.debugElement.query(By.css('.background-highlight'));
    expect(buttonElement).toBeTruthy();
  }));
  
  it('should not show tooltip on mouse enter if it is selected', fakeAsync(async () => {
    const id: any = "7857f006-4972-433f-9df3-9360a8164d03";
    const progress = 50;
    spyOn(component, 'showTooltip').and.callThrough();
    component.idealTimeArray = [];
    component.idealTime = 0;
    component.courseContent = allcourseContent;
    component.showTooltip(id, progress);
    fixture.detectChanges();
    expect(component.tooltip).toBeTrue();
    let buttonElement = fixture.debugElement.query(By.css('.background-highlight'));
    expect(buttonElement).toBeFalsy();
    spyOn(component, 'activeTocItem').and.callThrough();
    component.activeTocItem(id);
    tick(200);
    buttonElement = fixture.debugElement.query(By.css('.background-highlight'));
    expect(buttonElement).toBeTruthy();
    component.showTooltip(id, progress);
    fixture.detectChanges();
    expect(component.tooltip).toBeFalse();
    flush();
  }));

  it('should hide tooltip on mouse leave', fakeAsync(async () => {
    spyOn(component, 'hideTooltip').and.callThrough();
    component.hideTooltip();
    fixture.detectChanges();
    expect(component.hideTooltip).toHaveBeenCalled();
    const allElements = document.querySelectorAll('.tooltip-metadata');
    expect(component.tocOverflow).toEqual("");
  }));

  it('should return all Url Params', fakeAsync(async () => {
    spyOn(component, 'getUrlParams').and.callThrough();
    component.getUrlParams();
    fixture.detectChanges();
    expect(component.getUrlParams).toHaveBeenCalled();
  }));

  it("should show element in toc if it is selected from content area", fakeAsync(async () => {
    spyOn(storageService, 'set').withArgs(StorageKey.COURSE_JSON, allcourseContent).and.callThrough();
    storageService.set(StorageKey.COURSE_JSON, allcourseContent);
    fixture.detectChanges();
    expect(component.allcourseContent).toEqual(allcourseContent);
    leftNavService.nodeDetailsEmitter.next("7857f006-4972-433f-9df3-9360a8164d13");
    fixture.detectChanges();
    leftNavService.nodeDetailsEmitter.next("7857f006-4972-433f-9df3-9360a8164d03");
    fixture.detectChanges();
    leftNavService.nodeDetailsEmitter.next("c381e874-b605-42fb-8543-893ea72d4021");
    fixture.detectChanges();
    leftNavService.nodeDetailsEmitter.next("c381e874-b605-42fb-8543-893ea72d4022");
    fixture.detectChanges();
    spyOn(component.router, 'navigate').and.resolveTo(true);
    leftNavService.nodeActionPreviousNext.next("c381e874-b605-42fb-8543-893ea72d4027");
    fixture.detectChanges();
    flush();
  }));

  it("should return course Json", () => {
    const courseContent: any = [{
      _id: "7857f006-4972-433f-9df3-9360a8164d03",
      elementMetadata: [],
      elementId: "7857f006-4972-433f-9df3-9360a8164d03",
      name: "unit003 2 1",
      createdOn: "2021-10-25T09:54:14.938Z",
      status: "unpublished",
      progress: 50,
      idealTime: 73,
      numberOfContent: 1,
      completedContent: 0,
      type: "unit",
      children: []
    },
    {
      _id: "7857f006-4972-433f-9df3-9360a8164d13",
      elementMetadata: [],
      elementId: "7857f006-4972-433f-9df3-9360a8164d03",
      name: "folder 2 1",
      createdOn: "2021-10-25T09:54:14.938Z",
      status: "published",
      progress: 40,
      idealTime: 55,
      numberOfContent: 1,
      completedContent: 0,
      type: "folder",
      children: [],
    }];
    spyOn(storageService, 'listen').and.returnValue(of(courseContent));
    component.allcourseContent = courseContent;
    component.getCourseJson();
    fixture.detectChanges();
    expect(component.allcourseContent).toEqual(courseContent);
  });

  it('should return root level elements', () => {
    const allcourseContent: any = [{
      _id: "7857f006-4972-433f-9df3-9360a8164d03",
      elementMetadata: [],
      elementId: "7857f006-4972-433f-9df3-9360a8164d03",
      name: "unit003 2 1",
      createdOn: "2021-10-25T09:54:14.938Z",
      status: "unpublished",
      progress: 50,
      idealTime: 73,
      numberOfContent: 1,
      completedContent: 0,
      type: "unit",
      children: []
    },
    {
      _id: "7857f006-4972-433f-9df3-9360a8164d13",
      elementMetadata: [],
      elementId: "7857f006-4972-433f-9df3-9360a8164d13",
      name: "folder 2 1",
      createdOn: "2021-10-25T09:54:14.938Z",
      status: "published",
      progress: 40,
      idealTime: 55,
      numberOfContent: 1,
      completedContent: 0,
      type: "folder",
      children: [],
    }];
    const mockRresult = ["7857f006-4972-433f-9df3-9360a8164d03", "7857f006-4972-433f-9df3-9360a8164d13"];
    spyOn(component, 'getCourseJson').and.returnValue(allcourseContent);
    spyOn(component, "getAllRootElements").and.callThrough();
    component.allcourseContent = allcourseContent;
    component.getAllRootElements();
    const result = component.rootElementsId;
    fixture.detectChanges();
    expect(component.getAllRootElements).toHaveBeenCalled();
    expect(result).toEqual(mockRresult);
  });

  it('should refresh toc on click of root elements', fakeAsync(async () => {
    component.allcourseContent = allcourseContent;
    component.getUrlParams();
    const tocRoute: any = "[ '/learning-center/undefined/content-area/list/' ], Object({ relativeTo: Route(url:'', path:''), queryParams: Object({ toc: true }), queryParamsHandling: 'merge' })";
    spyOn(component, 'rootElementsClick').and.callThrough();
    spyOn(component.router, 'navigate').and.resolveTo(true);
    component.rootElementsClick();
    fixture.detectChanges();
    expect(component.rootElementsClick).toHaveBeenCalled();
    flush();
  }));

  it('should refresh toc on click of root elements with no children', fakeAsync(async () => {
    const allcourseContent: any = [{
      _id: "7857f006-4972-433f-9df3-9360a8164d03",
      elementMetadata: [],
      elementId: "7857f006-4972-433f-9df3-9360a8164d03",
      name: "unit003 2 1",
      createdOn: "2021-10-25T09:54:14.938Z",
      status: "unpublished",
      progress: 50,
      idealTime: 73,
      numberOfContent: 1,
      completedContent: 0,
      type: "unit",
      children: []
    }];
    component.allcourseContent = allcourseContent;
    component.getUrlParams();
    spyOn(component, 'rootElementsClick').and.callThrough();
    component.rootElementsClick();
    fixture.detectChanges();
    expect(component.rootElementsClick).toHaveBeenCalled();
    flush();
  }));

  it('should return children', fakeAsync(async () => {
    component.getUrlParams();
    const currentElement = {
      _id: "7857f006-4972-433f-9df3-9360a8164d03",
      elementMetadata: [],
      elementId: "7857f006-4972-433f-9df3-9360a8164d03",
      name: "unit003 2 1",
      createdOn: "2021-10-25T09:54:14.938Z",
      status: "unpublished",
      progress: 50,
      idealTime: 73,
      numberOfContent: 1,
      completedContent: 0,
      type: "unit",
      children: [{
        _id: "c381e874-b605-42fb-8543-893ea72d4021",
        elementMetadata: [],
        elementId: "c381e874-b605-42fb-8543-893ea72d4021",
        name: "test folder 1",
        createdOn: "2021-10-25T14:21:00.122Z",
        status: "unpublished",
        progress: 50,
        idealTime: 73,
        numberOfContent: 1,
        completedContent: 0,
        type: "folder",
        children: [],
      }]
    };
    const event = '';
    const tooltip = 'tooltip';
    spyOn(component, 'getchildren').withArgs(currentElement, event, tooltip).and.callThrough();
    spyOn(component.router, 'navigate').and.resolveTo(true);
    component.courseContent = allcourseContent;
    component.getchildren(currentElement, event, tooltip);
    fixture.detectChanges();
    expect(component.getchildren).toHaveBeenCalled();
    flush();
  }));

  it('should return current element if the element not having children', fakeAsync(async () => {
    component.getUrlParams();
    const currentElement = {
      _id: "7857f006-4972-433f-9df3-9360a8164d03",
      elementMetadata: [],
      elementId: "7857f006-4972-433f-9df3-9360a8164d03",
      name: "unit003 2 1",
      createdOn: "2021-10-25T09:54:14.938Z",
      status: "unpublished",
      progress: 50,
      idealTime: 73,
      numberOfContent: 1,
      completedContent: 0,
      type: "unit",
      children: []
    };
    const event = '';
    const tooltip = 'tooltip';
    spyOn(component, 'getchildren').withArgs(currentElement, event, tooltip).and.callThrough();
    spyOn(component.router, 'navigate').and.resolveTo(true);
    component.courseContent = allcourseContent;
    component.getchildren(currentElement, event, tooltip);
    fixture.detectChanges();
    expect(component.getchildren).toHaveBeenCalled();
    flush();
  }));

  it('should keep root elements in toc on click of Previous or Next button root element without children', fakeAsync(async () => {
    component.getUrlParams();
    const currentElement = {
      _id: "7857f006-4972-433f-9df3-9360a8164d03",
      elementMetadata: [],
      elementId: "7857f006-4972-433f-9df3-9360a8164d03",
      name: "unit003 2 1",
      createdOn: "2021-10-25T09:54:14.938Z",
      status: "unpublished",
      progress: 50,
      idealTime: 73,
      numberOfContent: 1,
      completedContent: 0,
      type: "unit",
      children: []
    };
    spyOn(component, 'prevNextAction').withArgs(currentElement).and.callThrough();
    spyOn(component.router, 'navigate').and.resolveTo(true);
    component.allcourseContent = allcourseContent;
    component.prevNextAction(currentElement);
    fixture.detectChanges();
    expect(component.prevNextAction).toHaveBeenCalled();
    flush();
  }));

  it('should load with child elements in toc on click of Previous or Next button root element with children', fakeAsync(async () => {
    component.getUrlParams();
    const currentElement = {
      _id: "7857f006-4972-433f-9df3-9360a8164d03",
      elementMetadata: [],
      elementId: "7857f006-4972-433f-9df3-9360a8164d03",
      name: "unit003 2 1",
      createdOn: "2021-10-25T09:54:14.938Z",
      status: "unpublished",
      progress: 50,
      idealTime: 73,
      numberOfContent: 1,
      completedContent: 0,
      type: "unit",
      children: [{
        _id: "c381e874-b605-42fb-8543-893ea72d4021",
        elementMetadata: [],
        elementId: "c381e874-b605-42fb-8543-893ea72d4021",
        name: "test folder 1",
        createdOn: "2021-10-25T14:21:00.122Z",
        status: "unpublished",
        progress: 50,
        idealTime: 73,
        numberOfContent: 1,
        completedContent: 0,
        type: "folder",
        children: [],
      }]
    };
    spyOn(component, 'prevNextAction').withArgs(currentElement).and.callThrough();
    spyOn(component.router, 'navigate').and.resolveTo(true);
    component.allcourseContent = allcourseContent;
    component.prevNextAction(currentElement);
    fixture.detectChanges();
    expect(component.prevNextAction).toHaveBeenCalled();
    flush();
  }));

  it('should load specific element with child on click of previous & next', fakeAsync(async () => {
    component.getUrlParams();
    const currentClickedElement = {
      _id: "c381e874-b605-42fb-8543-893ea72d4021",
      elementMetadata: [],
      elementId: "c381e874-b605-42fb-8543-893ea72d4021",
      name: "test folder 1",
      createdOn: "2021-10-25T14:21:00.122Z",
      status: "unpublished",
      progress: 50,
      idealTime: 73,
      numberOfContent: 1,
      completedContent: 0,
      type: "folder",
      children: [],
    };
    spyOn(component, 'prevNextAction').withArgs(currentClickedElement).and.callThrough();
    spyOn(component.router, 'navigate').and.resolveTo(true);
    component.allcourseContent = allcourseContent;
    component.prevNextAction(currentClickedElement);
    fixture.detectChanges();
    expect(component.prevNextAction).toHaveBeenCalled();
    flush();
  }));

  it('should keep root elements on click of root level element previous click', fakeAsync(async () => {
    component.getUrlParams();
    spyOn(component, 'previous').withArgs().and.callThrough();
    spyOn(component.router, 'navigate').and.resolveTo(true);
    component.rootElementsId = ["7857f006-4972-433f-9df3-9360a8164d03", "7857f006-4972-433f-9df3-9360a8164d13"];
    component.tocElementId = "7857f006-4972-433f-9df3-9360a8164d03";
    component.allcourseContent = allcourseContent;
    component.previous();
    fixture.detectChanges();
    expect(component.previous).toHaveBeenCalled();
    flush();
  }));

  it('should load with child elements on click of child element previous click', fakeAsync(async () => {
    component.getUrlParams();
    spyOn(component, 'previous').withArgs().and.callThrough();
    spyOn(component.router, 'navigate').and.resolveTo(true);
    component.rootElementsId = ["7857f006-4972-433f-9df3-9360a8164d03", "7857f006-4972-433f-9df3-9360a8164d13"];
    component.tocElementId = "c381e874-b605-42fb-8543-893ea72d4021";
    component.allcourseContent = allcourseContent;
    component.previous();
    fixture.detectChanges();
    expect(component.previous).toHaveBeenCalled();
    flush();
  }));

  it('should refresh toc onclick of back to content area button', fakeAsync(async () => {
    component.getUrlParams();
    const tocRoute: any = "[ '/learning-center/undefined/content-area/list/' ], Object({ relativeTo: Route(url:'', path:''), queryParams: Object({ toc: true }), queryParamsHandling: 'merge' })";
    spyOn(component, 'backToContentArea').and.callThrough();
    spyOn(component.router, 'navigate').and.resolveTo(true);
    component.backToContentArea();
    fixture.detectChanges();
    expect(component.backToContentArea).toHaveBeenCalled();
  }));

  it('should open modal box for edit', fakeAsync(async () => {
    component.getUrlParams();
    const element: any = {
      _id: "7857f006-4972-433f-9df3-9360a8164d13",
      elementMetadata: [],
      elementId: "7857f006-4972-433f-9df3-9360a8164d13",
      name: "folder 2 1",
      createdOn: "2021-10-25T09:54:14.938Z",
      status: "published",
      progress: 40,
      idealTime: 55,
      numberOfContent: 1,
      completedContent: 0,
      type: "folder",
      children: [],
    };
    const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
    spyOn(component, 'edit').withArgs(element, event).and.callThrough();
    spyOn(component.router, 'navigate').and.resolveTo(true);
    component.edit(element, event);
    fixture.detectChanges();
    expect(component.edit).toHaveBeenCalled();
  }));

  it('should open alert model box for delete', fakeAsync(async () => {
    component.getUrlParams();
    const element: any = {
      _id: "7857f006-4972-433f-9df3-9360a8164d13",
      elementMetadata: [],
      elementId: "7857f006-4972-433f-9df3-9360a8164d13",
      name: "folder 2 1",
      createdOn: "2021-10-25T09:54:14.938Z",
      status: "published",
      progress: 40,
      idealTime: 55,
      numberOfContent: 1,
      completedContent: 0,
      type: "folder",
      children: [],
    };
    const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
    spyOn(component, 'delete').withArgs(element, event).and.callThrough();
    spyOn(component.router, 'navigate').and.resolveTo(true);
    component.delete(element, event);
    fixture.detectChanges();
    expect(component.delete).toHaveBeenCalled();
  }));

  it('should close toast', fakeAsync(async () => {
    spyOn(component, 'closeToast').and.callThrough();
    component.closeToast();
    fixture.detectChanges();
    expect(component.closeToast).toHaveBeenCalled();
  }));

  it('should return all transaled messages', fakeAsync(async () => {
    component.messagesTranslations = {};
    spyOn(component, 'getMessageTranslations').and.callThrough();
    component.getMessageTranslations();
    fixture.detectChanges();
    expect(component.getMessageTranslations).toHaveBeenCalled();
  }));

});

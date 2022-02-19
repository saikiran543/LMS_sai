/* eslint-disable max-depth */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/services/storage.service';
import { JWTService } from 'src/app/services/jwt.service';
import { UserRoles } from 'src/app/enums/userRoles';
import { BehaviorSubject, Subject, Subscription, takeUntil } from 'rxjs';
import { StorageKey } from 'src/app/enums/storageKey';
import { ContentService } from 'src/app/learning-center/course-services/content.service';
import { ContentType } from 'src/app/enums/contentType';

@Component({
  selector: 'app-toc',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.scss']
})

export class TocComponent {
  rootElementsId: any = [];
  tocElementTitle: any;
  tocElementId: any;
  tocElementType: any;
  courseId = "";
  parentElement = false;
  elementIdParam = "";
  tooltipContents: any = [];
  elementMetaData: any;
  tooltip: any;
  idealTime: any;
  idealTimeArray: any = [];
  student = false;
  faculty = false;
  userCurrentview: any;
  constUserRole = UserRoles;
  progress: any;
  tocToast = false;
  toastType = 'error'
  toastMessage: any = "";
  messagesTranslations: any = {
    deleteNode: 'toc.deleteConfirm',
    visibilityCriteria: 'toc.visibilityCriteria',
    unpublishedContent: 'toc.unpublishedContent',
    publishedContent: 'toc.publishedContent'

  }
  dataChange = new BehaviorSubject<any>([]);
  courseContent: any;
  allcourseContent:any;
  lastClickedElementId: any;
  tocOverflow: any;
  nodeDetailsEmitterSubscription: Subscription = new Subscription;
  $unsubscribeNodeActionPreviousNext = new Subject<void>()
  contentType = ContentType;
  constructor(
    private leftNavService: LeftNavService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private translate: TranslateService,
    private storageService: StorageService,
    private jwtService:JWTService,
    private elementRef: ElementRef,
    private contentService: ContentService
  ) {
    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
    this.getUrlParams();
      
    this.nodeDetailsEmitterSubscription = this.leftNavService.nodeDetailsEmitter.subscribe(async (id) => {
      if(id){
        this.elementIdParam = id;
      }else{
        this.elementIdParam = snapshot?.root.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.params.id;
      }
      await this.loadToc(this.elementIdParam);
    });
    this.leftNavService.nodeActionPreviousNext.pipe(takeUntil(this.$unsubscribeNodeActionPreviousNext)).subscribe(id => {
      if(id){
        const element = this.locateElementMetaData(this.allcourseContent, id);
        this.prevNextAction(element);
      }
    });
  }

  async ngOnInit() {
    try {
      this.userCurrentview = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
      // eslint-disable-next-line no-empty
    } catch(err){}
    
    await this.getMessageTranslations();
  }

  async loadToc(id: any){
    await this.getCourseJson();
    if(this.allcourseContent.length){
      const element = await this.locateElementMetaData(this.allcourseContent, id);
      if(element) {
        const rootElementsIdArray:any = [];
        if(this.allcourseContent !== undefined && this.allcourseContent.length > 0){
          this.allcourseContent.forEach((element:any) => {
            if(!rootElementsIdArray.includes(element.elementId)){
              rootElementsIdArray.push(element.elementId);
            }
       
          });
          if(element.elementId !== null){
            if(rootElementsIdArray.includes(element.elementId)){
              if(element.children.length > 0){
                this.tocElementTitle = element.name;
                this.tocElementType = element.type;
                this.tocElementId = element.elementId;
                this.parentElement = true;
                this.courseContent = [];
                this.courseContent = element.children;
              }else{
                this.parentElement = false;
                this.courseContent = [];
                this.courseContent = this.allcourseContent;
              }
            }else{
            // eslint-disable-next-line no-lonely-if
              if(element.children.length > 0){
                this.tocElementTitle = element.name;
                this.tocElementType = element.type;
                this.tocElementId = element.elementId;
                this.parentElement = true;
                this.courseContent = [];
                this.courseContent = element.children;
              }else{
                this.courseContent = [];
                const currentElement = await this.locateElement(this.allcourseContent, element.elementId);
                this.tocElementTitle = currentElement.name;
                this.tocElementType = currentElement.type;
                this.tocElementId = currentElement.elementId;
                this.parentElement = true;
                this.courseContent = currentElement.children;
                this.activeTocItem(element.elementId);
  
              }
            }
          }
          this.activeTocItem(element.elementId);
        }
      }
    }
  }

  async getMessageTranslations() {
    for (const key in this.messagesTranslations) {
      if (Object.prototype.hasOwnProperty.call(this.messagesTranslations, key)) {
        this.messagesTranslations[key] = await this.translate.get(this.messagesTranslations[key]).toPromise();
      }
    }
  }

  async showTooltip(id: any, progress:any) {
    this.progress = Math.round(progress);
    if (!this.elementRef.nativeElement.querySelector("#node_" + id)?.classList.contains("background-highlight")) {
      this.tooltip = true;
      this.elementMetaData = await this.locateElementMetaData(this.courseContent, id);
      this.idealTimeArray = [];
      this.idealTime = 0;
    } else {
      this.tooltip = false;
    }
    this.tocOverflow = 'tocOverflow';
    const parentDivHeight:any = this.elementRef.nativeElement.querySelector("#toc-tree-holder")?.clientHeight;
    const tooltipHeight:any = this.elementRef.nativeElement.querySelector("#tooltip_"+id)?.clientHeight;
    const elementPosition:any = this.elementRef.nativeElement.querySelector("#node_" + id)?.offsetTop;
    if(tooltipHeight+20 > elementPosition+(tooltipHeight/2)){
      (this.elementRef.nativeElement.querySelector("#tooltip_"+id) as HTMLDivElement).style.top = '0px';
      (this.elementRef.nativeElement.querySelector("#tooltip_"+id) as HTMLDivElement).style.bottom = 'auto';
      if((this.elementRef.nativeElement.querySelector("#tooltip_"+id) as HTMLDivElement)?.classList.contains("arrow-bottom")){
        (this.elementRef.nativeElement.querySelector("#tooltip_"+id) as HTMLDivElement)?.classList.remove("arrow-bottom");
      }
      (this.elementRef.nativeElement.querySelector("#tooltip_"+id) as HTMLDivElement)?.classList.add("arrow-top");
    }else if(parentDivHeight < elementPosition+(tooltipHeight/2)){
      (this.elementRef.nativeElement.querySelector("#tooltip_"+id) as HTMLDivElement).style.bottom = '0px';
      (this.elementRef.nativeElement.querySelector("#tooltip_"+id) as HTMLDivElement).style.top = 'auto';
      if((this.elementRef.nativeElement.querySelector("#tooltip_"+id) as HTMLDivElement)?.classList.contains("arrow-top")){
        (this.elementRef.nativeElement.querySelector("#tooltip_"+id) as HTMLDivElement)?.classList.remove("arrow-top");
      }
      (this.elementRef.nativeElement.querySelector("#tooltip_"+id) as HTMLDivElement)?.classList.add("arrow-bottom");
    }else{
      // eslint-disable-next-line no-lonely-if
      if((this.elementRef.nativeElement.querySelector("#tooltip_"+id) as HTMLDivElement)?.classList.contains("arrow-bottom")){
        (this.elementRef.nativeElement.querySelector("#tooltip_"+id) as HTMLDivElement)?.classList.remove("arrow-bottom");
      }else if((this.elementRef.nativeElement.querySelector("#tooltip_"+id) as HTMLDivElement)?.classList.contains("arrow-top")){
        (this.elementRef.nativeElement.querySelector("#tooltip_"+id) as HTMLDivElement)?.classList.remove("arrow-top");
      }
    }
  }
  hideTooltip() {
    this.tocOverflow = '';
  }

  async getUrlParams() {
    const getParams = (route: any) => ({
      ...route.params,
      ...route.children.reduce((acc: any, child: any) =>
        ({ ...getParams(child), ...acc }), {})
    });
    const urlParams = getParams(this.router.routerState.snapshot.root);
    this.courseId = urlParams.courseId;
    this.elementIdParam = urlParams.id;
  }
  async getCourseJson(){
    this.allcourseContent = [];
    try {
      await this.storageService.listen(StorageKey.COURSE_JSON).subscribe((res: any) => {
        this.allcourseContent = res;
      });
    } catch (error) {
      await this.courseJson();
    }
    if(!this.allcourseContent.length){
      await this.courseJson();
    }
  }
  async courseJson():Promise<any>{
    await this.contentService.getContentDetails(this.courseId, true);
    await this.storageService.listen(StorageKey.COURSE_JSON).subscribe((res: any) => {
      this.allcourseContent = res;
    });
  }

  getNodeIconType(node: any) {
    let nodeType = node.type;
    if(nodeType === ContentType.DISCUSSION_FORUM && node.elementMetadata?.subContentType) {
      nodeType = node.elementMetadata.subContentType;
    }
    return nodeType;
  }
  
  activeTocItem(elementId: any) {
    setTimeout(async() => {
      const allElements = await this.elementRef.nativeElement.querySelectorAll('.element');
      [].forEach.call(allElements, function (element: any) {
        element.classList.remove("background-highlight");
      });
      if(await this.elementRef.nativeElement.querySelector("#node_" + elementId)){
        await this.elementRef.nativeElement.querySelector("#node_" + elementId)?.classList.add("background-highlight");
      }else{
        allElements[0]?.classList.add("background-highlight");
      }
      
    }, 100);
  }

  async getAllRootElements() {
    this.rootElementsId = this.allcourseContent.map((element: any) => {
      return element.elementId;
    });
    this.parentElement = false;
  }

  rootElementsClick() {
    this.getUrlParams();
    this.parentElement = false;
    this.courseContent = this.allcourseContent;
    if (this.allcourseContent[0].children.length > 0) {
      this.getchildren(this.allcourseContent[0], "", "");
    } else{
      this.leftNavService.setNodeFromToc(this.allcourseContent[0]._id);
      this.activeTocItem(this.allcourseContent[0]._id);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getchildren(element: any, event: any, tooltip:any) {
    await this.getUrlParams();
    this.tocElementTitle = element.name;
    this.tocElementType = element.type;
    this.tocElementId = element.elementId;
    this.parentElement = true;
    this.courseContent.forEach((tocElement: any) => {
      if (tocElement.elementId === element.elementId) {
        this.courseContent = tocElement.children;
      }
    });
    this.leftNavService.setNodeFromToc(element.elementId);
    this.activeTocItem(element.elementId);
    if(event){event.stopPropagation();}
  }

  async prevNextAction(element: any) {
    await this.getCourseJson();
    const currentElement = element;
    const rootElementsIdArray:any = [];
    this.allcourseContent.forEach((element:any) => {
      if(!rootElementsIdArray.includes(element.elementId)){
        rootElementsIdArray.push(element.elementId);
      }
    });
    if(rootElementsIdArray.includes(currentElement.elementId)){
      if(element.children.length > 0)
      {
        this.tocElementTitle = element.name;
        this.tocElementType = element.type;
        this.tocElementId = element.elementId;
        this.parentElement = true;
        this.courseContent = element.children;
      } else{
        this.parentElement = false;
        this.courseContent = this.allcourseContent;
      }
    }else{
      const parentElement = this.locateElement(this.allcourseContent, element.elementId);
      this.tocElementTitle = parentElement.name;
      this.tocElementType = parentElement.type;
      this.tocElementId = parentElement.elementId;
      this.parentElement = true;
      this.courseContent = parentElement.children;
    }
    this.getUrlParams();
    this.router.navigate(['/learning-center/' + this.courseId + '/content-area/list/content/' + element.elementId], { relativeTo: this.activatedRoute, queryParams: { toc: true }, queryParamsHandling: 'merge' });
    this.activeTocItem(element.elementId);
  }

  async previous() {
    await this.getAllRootElements();
    await this.getUrlParams();
    if (this.rootElementsId.includes(this.tocElementId)) {
      this.courseContent = this.allcourseContent;
      this.router.navigate(['/learning-center/' + this.courseId + '/content-area/list/'], { relativeTo: this.activatedRoute, queryParams: { toc: false }, queryParamsHandling: 'merge' });

    } else {
      const previousElementWithChild = this.locateElement(this.allcourseContent, this.tocElementId);
      this.tocElementId = previousElementWithChild.elementId;
      this.tocElementTitle = previousElementWithChild.name;
      this.tocElementType = previousElementWithChild.type;
      this.parentElement = true;
      this.courseContent = previousElementWithChild.children;
      this.router.navigate(['/learning-center/' + this.courseId + '/content-area/list/content/' + previousElementWithChild.elementId], { relativeTo: this.activatedRoute, queryParams: { toc: true }, queryParamsHandling: 'merge' });
      this.activeTocItem(previousElementWithChild.elementId);
    }
  }

  locateElement(rootElementsId: any, elementId: any) {
    for (const element of rootElementsId) {
      if (element.elementId === elementId) {
        return element;
      } else if (element.children && element.children.length > 0) {
        for (const children of element.children) {
          if (children.elementId === elementId) {
            return element;
          }
        }
        const elemFoundInChild: any = this.locateElement(
          element.children,
          elementId
        );
        if (elemFoundInChild) {
          return elemFoundInChild;
        }
      }
    }
    return null;
  }

  async backToContentArea() {
    this.leftNavService.messageEmitter.next(false);
    await this.getUrlParams();
    this.router.navigate(['/learning-center/' + this.courseId + '/content-area/list/'], { relativeTo: this.activatedRoute, queryParams: { toc: false }, queryParamsHandling: 'merge' });
  }

  locateElementMetaData(rootElementsId: any, elementId: any) {
    if (rootElementsId && rootElementsId.length) {
      for (const element of rootElementsId) {
        if (element.elementId === elementId) {
          return element;
        } else if (element.children && element.children.length > 0) {
          for (const children of element.children) {
            if (children.elementId === elementId) {
              return children;
            }
          }
          const elemFoundInChild: any = this.locateElementMetaData(
            element.children,
            elementId
          );
          if (elemFoundInChild) {
            return elemFoundInChild;
          }
        }
      }
      return null;
    }
  }

  async edit(element: any, event: any) {
    await this.getUrlParams();
    const type = element.type.toLowerCase();
    this.router.navigate(['/learning-center/' + this.courseId + '/content-area/list/manipulate/edit/' + type + '/' + element.elementId], { relativeTo: this.activatedRoute, queryParams: { toc: true }, queryParamsHandling: 'merge' });
    event.stopPropagation();
  }

  async delete(element: any, event: any) {
    this.leftNavService.setDeleteNodeFromToc(element);
    event.stopPropagation();
  }

  closeToast(): void {
    this.tocToast = false;
  }

  ngOnDestroy(){
    this.leftNavService.setDeleteNodeFromToc("");
    this.leftNavService.setNodeFromToc(null);
    this.$unsubscribeNodeActionPreviousNext.complete();
  }

}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-invalid-this */
import { SelectionModel } from '@angular/cdk/collections';
import { Platform } from '@angular/cdk/platform';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, Input, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonUtils } from 'src/app/utils/common-utils';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TreeOperations } from 'src/app/enums/treeOperations';
import { ContentService } from 'src/app/learning-center/course-services/content.service';
import { ContentItemFlatNode, ContentItemNode } from 'src/app/model';
import { CommonService } from 'src/app/services/common.service';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { StorageService } from 'src/app/services/storage.service';
import { ListComponent, ChecklistDatabase } from '../list.component';
import { ElementStatuses } from 'src/app/enums/ElementStatuses';
import { StorageKey } from 'src/app/enums/storageKey';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { filter } from 'rxjs';
import { ContentType } from 'src/app/enums/contentType';

@Component({
  selector: 'app-student-course-view',
  templateUrl: './student-course-view.component.html',
  styleUrls: ['./student-course-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StudentCourseViewComponent extends ListComponent {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<ContentItemFlatNode, ContentItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<ContentItemNode, ContentItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: ContentItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<ContentItemFlatNode>;

  treeFlattener: MatTreeFlattener<ContentItemNode, ContentItemFlatNode>;

  moreInfo = "";

  description!:SafeHtml;

  lastAccessedTime = "";

  dataSource: MatTreeFlatDataSource<ContentItemNode, ContentItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<ContentItemFlatNode>(
    true /* multiple */
  );

  initialData!: ContentItemNode[];
  isFirstLoad = true;
  nodeId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  restrictionRules: any = {
    'above': {
      'unit': ['folder', 'content'],
    },
    'below': {
      'unit': ['folder', 'content'],
    },
    'center': {
      'unit': ['unit', 'folder', 'content'],
      'folder': ['content'],
      'content': ['content']
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  /* Drag and drop */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragNode: ContentItemFlatNode | ContentItemNode | any;
  dragNodeExpandOverWaitTimeMs = 300;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragNodeExpandOverNode: any;
  dragNodeExpandOverTime!: number;
  dragNodeExpandOverArea!: string;
  @ViewChild('emptyItem') emptyItem!: ElementRef;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragNewElm: any;
  currentItemHtml!: HTMLElement;
  currentHoverNode = '';
  isDropAllowedFlag = false;
  viewMore = false;

  @Input() isPreview = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ContextMenuOperation: any = [
    {
      name: 'Download',
      event: 'download',
      icon: 'icon-download',
      conditionFunc: 'isDownload'
    },
    {
      name: 'Bookmark',
      event: 'bookmark',
      icon: 'icon-bookmark',
      conditionFunc: 'isNotBookMarked'
    }
  ]

  // eslint-disable-next-line max-params
  constructor(
    private database: ChecklistDatabase,
    private renderer: Renderer2,
    private platform: Platform,
    private ngbModal: NgbModal,
    public activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private commonUtils: CommonUtils,
    private router: Router,
    public storageService: StorageService,
    private contentService: ContentService,
    private commonService: CommonService,
    private leftNavService: LeftNavService,
    private sanitizer: DomSanitizer
  ) {
    super(activatedRoute, storageService);
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<ContentItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    database.dataChange.subscribe(data => {
      let treeData = data;
      if (this.isPreview) {
        treeData = JSON.parse(JSON.stringify(data));
        this.filterPublished(treeData);
      }
      if (this.isFirstLoad) {
        this.initialData = treeData;
        this.isFirstLoad = false;
      }
      this.dataSource.data = [];
      this.dataSource.data = treeData;
      //this.treeControl.expand(this.dataSource['_flattenedData']['_value'][0]);
    });
  }

  getLevel = (node: ContentItemFlatNode): number => node.level;

  isExpandable = (node: ContentItemFlatNode): boolean => node.expandable;

  isFolder = (node: ContentItemFlatNode): string => node.type;

  getChildren = (node: ContentItemNode): ContentItemNode[] => node.children;

  // eslint-disable-next-line id-length
  hasChild = (_: number, _nodeData: ContentItemFlatNode): boolean => _nodeData.expandable;

  // eslint-disable-next-line id-length
  hasNoContent = (_: number, _nodeData: ContentItemFlatNode): boolean =>
    _nodeData.name === '';

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getFlatNodeById = (id: string) => this.treeControl.dataNodes.filter(data => data._id === id)[0] || null;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: ContentItemNode, level: number): ContentItemFlatNode => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name
        ? existingNode
        : new ContentItemFlatNode();
    flatNode._id = node._id;
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.type = node.type;
    flatNode.subContentType = node?.elementMetadata?.subContentType;
    flatNode.progress = node.progress;
    flatNode.idealTime = node.idealTime;
    flatNode.contentStatus= node.contentStatus;
    flatNode.numberOfContent = node.numberOfContent;
    flatNode.completedContent = node.completedContent;
    flatNode.isBookMarked = node.isBookMarked;
    flatNode.allowDownload = node.elementMetadata.allowDownload;
    flatNode.expandable = node.children && node.children.length > 0;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  public filterPublished(elementArray:any) :void {
    for (let i = 0; i < elementArray.length; i++) {
      if (
        elementArray[i].status === ElementStatuses.UNPUBLISHED ||
        elementArray[i].status === ElementStatuses.DRAFT
      ) {
        elementArray.splice(i, 1);
        i--;
      } else if (
        elementArray[i].children &&
        elementArray[i].children.length > 0
      ) {
        this.filterPublished(elementArray[i].children);
      }
    }
  }
  ngOnInit(): void{
    this.storageService.listen('updateProgress').subscribe(res=>{
      const node = this.getFlatNodeById(res.elementId);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const nestedNode = this.flatNodeMap.get(node)!;
      nestedNode.progress = res.progress;
      nestedNode.completedContent = res.progress === 100? 1: 0;
      this.database.refreshTree();
      this.calculateProgress(node);
    });
    this.activatedRoute.queryParams.pipe(filter(params=>Object.keys(params).includes('preview'))).subscribe(params=>{
      this.isPreview = params.preview?JSON.parse(params.preview):false;
      this.storageService.broadcastValue(StorageKey.COURSE_JSON);
    });
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: ContentItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return descendants.every((child: any) =>
      this.checklistSelection.isSelected(child)
    );
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: ContentItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = descendants.some((child: any) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: ContentItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  applyStyles(node: any): any {
    const styles = { 'padding-left': node.level * 40 + 'px' };
    return styles;
  }

  async toggleBookmark(node: ContentItemFlatNode): Promise<void> {
    const payload = {
      courseId: this.courseId,
      elementId: node._id,
    };
    const element = this.flatNodeMap.get(node)!;
    if (element.isBookMarked) {
      const deleted = await this.contentService.deleteBookmark(payload.elementId, node.name);
      if (deleted) {
        element.isBookMarked = false;
      }
    } else {
      element.isBookMarked = await this.contentService.createBookmark(payload);
    }
  }

  applyProgressStyle(node: ContentItemFlatNode) : string{
    if (node.progress === 100) {
      return 'completed';
    } else if(node.progress < 49) {
      return 'incomplete';
    }
    return 'inprogress';
  }
 
  calculateProgress(node : ContentItemFlatNode): void{
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const parentNode = this.getParent(node);
    if (parentNode) {
      const childContentNodes = this.treeControl.getDescendants(parentNode).filter(element=>element.type !=='folder');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const nestedParentNode = this.flatNodeMap.get(parentNode)!;
      nestedParentNode.progress = childContentNodes.reduce((sum:number, element:ContentItemFlatNode) => sum+ element.progress, 0)/childContentNodes.length;
      nestedParentNode.completedContent = childContentNodes.reduce((sum:number, element:ContentItemFlatNode) => sum+ (element.progress === 100? element.completedContent? element.completedContent : 0: 0), 0);
      this.calculateProgress(parentNode);
    }
    this.database.refreshTree();
  }

  getMandatory(): string {
    const mandatoryArray = [
      'Optional',
      'Mandatory'
    ];
    const randomElement = mandatoryArray[Math.floor(Math.random() * mandatoryArray.length)];
    return randomElement;
  }

  getNodeIconType(node: ContentItemFlatNode) {
    let nodeType = node.type;
    if(nodeType === ContentType.DISCUSSION_FORUM && node.subContentType) {
      nodeType = node.subContentType;
    }
    return nodeType?.toLowerCase();
  }

  clickNode(node: ContentItemFlatNode): void {
    if(node.type === ContentType.DISCUSSION_FORUM) {
      this.router.navigate(['../../discussion-forums/forum-detail/' + node._id], { relativeTo: this.activatedRoute, queryParams: {toc: false}, queryParamsHandling: 'merge' });
    } else {
      this.router.navigate(['./content/' + node._id], { relativeTo: this.activatedRoute, queryParams: { toc: true }, queryParamsHandling: 'merge' });
      this.leftNavService.messageEmitter.next(true);
      this.leftNavService.nodeDetailsEmitter.next(node._id);
    }
  }

  async toggleMoreInfo(node: ContentItemFlatNode): Promise<void> {
    if (this.moreInfo !== node.name) {
      const response = await this.contentService.getElementDetailsForMoreInfo(this.courseId, node._id);
      if(response.body && response.body.description && response.body.description.length > 480){
        this.viewMore = true;
        this.description = this.sanitizer.bypassSecurityTrustHtml(response.body.description.substr(0, 480));
      }else{
        response.body.description = response.body.description === null || response.body.description === ""? "<p style=\"color:#FF6600;\">No Description Available</p>": response.body.description;
        this.description = this.sanitizer.bypassSecurityTrustHtml(response.body.description);
        this.viewMore = false;
      }
      this.lastAccessedTime = response.body.lastAccessedTime;
      if (this.lastAccessedTime) {
        this.lastAccessedTime = this.commonUtils.timestampToDate(this.lastAccessedTime);
      }
      this.moreInfo = node.name;
    }
    else {
      this.moreInfo = "";
    }
  }

  async treeOperations(event: string, node: ContentItemFlatNode): Promise<void> {
    switch (event) {
      case TreeOperations.DOWNLOAD:{
        const {body} = await this.contentService.getElementDetail(this.courseId, node._id);
        const elementData = body;
        const response = await this.commonService.getSignedUrl(elementData.s3FileName,elementData.originalFileName);
        window.open(response.body.url);
      }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        break;
      case TreeOperations.BOOKMARK:
        this.toggleBookmark(node);
        break;
      default:
        break;
    }
  }
  displayContextMenuItem(event: string, node: ContentItemFlatNode) : boolean {
    switch (event) {
      case TreeOperations.DOWNLOAD:{
        if(node.type === 'unit'||node.type === 'folder'){
          return false;
        // eslint-disable-next-line no-else-return
        }else{
          return node.allowDownload? node.allowDownload: false;
        }
      }
      case TreeOperations.BOOKMARK:
        return !node.isBookMarked;
      default:{
        return true;
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getParent(node: ContentItemFlatNode): ContentItemFlatNode | null | any {
    const { treeControl } = this;
    const currentLevel = treeControl.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = treeControl.dataNodes[i];

      if (treeControl.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
  }

  applyStylesForMoreInfo(node: any) {
    const styles = { 'padding-left': node.level * 40 + 90 + 'px'};
    return styles;
  }

}

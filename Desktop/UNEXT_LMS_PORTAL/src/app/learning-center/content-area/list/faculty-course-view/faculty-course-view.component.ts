/* eslint-disable max-lines */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectionModel } from '@angular/cdk/collections';
import { Platform } from '@angular/cdk/platform';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CommonUtils } from 'src/app/utils/common-utils';
import { Component, ElementRef, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { TreeOperations } from 'src/app/enums/treeOperations';
import { ContentService } from 'src/app/learning-center/course-services/content.service';
import { ContentItemFlatNode, ContentItemNode } from 'src/app/model';
import { LocationSelectionComponent } from '../../../manipulation/location-selection/location-selection.component';
import { ChecklistDatabase, ListComponent } from '../list.component';
import { DialogService } from 'src/app/services/dialog.service';
import { Dialog } from 'src/app/Models/Dialog';
import { DialogTypes } from 'src/app/enums/Dialog';
import { StorageService } from 'src/app/services/storage.service';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { ElementStatuses } from 'src/app/enums/ElementStatuses';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { StorageKey } from 'src/app/enums/storageKey';
import { ContentType } from 'src/app/enums/contentType';

@Component({
  selector: 'app-faculty-course-view',
  templateUrl: './faculty-course-view.component.html',
  styleUrls: ['./faculty-course-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FacultyCourseViewComponent extends ListComponent {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<ContentItemFlatNode, ContentItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<ContentItemNode, ContentItemFlatNode>();

  moreInfo = "";

  /** A selected parent node to be inserted */
  selectedParent: ContentItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<ContentItemFlatNode>;

  treeFlattener: MatTreeFlattener<ContentItemNode, ContentItemFlatNode>;

  dataSource: MatTreeFlatDataSource<ContentItemNode, ContentItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<ContentItemFlatNode>(
    true /* multiple */
  );

  initialData!: ContentItemNode[];

  isFirstLoad = true;
  viewMore = false;
  description!:SafeHtml;

  lastAccessedTime = "";

  nodeId = 0;
  contentTypes = ['document', 'audio', 'epub', 'html', 'video', 'image','otherattachements', 'weblink', 'scorm', 'standard_discussion_forum', 'doubt_clarification_forum']
  restrictionRules: any = {
    'above': {
      'unit': ['folder', ...this.contentTypes],
    },
    'below': {
      'unit': ['folder', ...this.contentTypes],
    },
    'center': {
      'unit': ['unit', 'folder', ...this.contentTypes],
      'folder': this.contentTypes,
      'document': this.contentTypes,
      'audio': this.contentTypes,
      'epub': this.contentTypes,
      'html': this.contentTypes,
      'video': this.contentTypes,
      'image': this.contentTypes,
      'weblink': this.contentTypes,
      'scorm': this.contentTypes,
      'otherattachements': this.contentTypes,
      'standard_discussion_forum': this.contentTypes,
      'doubt_clarification_forum': this.contentTypes
    }
  };

  ContextMenuOperation: any = [
    {
      name: 'Add as Bookmark',
      event: 'addAsBookmark',
      icon: 'icon-bookmark-grey',
      conditionFunc: 'isNotBookMarked'
    },
    {
      name: 'Edit',
      event: 'edit',
      icon: 'icon-edit'
    },
    //  {
    //    name: 'Clone',
    //    event: 'clone'
    //  },
    {
      name: 'Delete',
      event: 'delete',
      icon: 'icon-delete'
    },
    //  {
    //    name: 'Visibility Criteria',
    //    event: 'visibilityCriteria'
    //  },
    {
      name: 'Add Learning Objective',
      event: 'addLearningObjective',
      icon: 'icon-addlearningobjective',
      conditionFunc: 'addLearningObjective'
    },
    {
      name: 'Learning Objective',
      event: 'viewLearningObjective',
      icon: 'icon-addlearningobjective',
      conditionFunc: 'viewLearningObjective'

    },
    {
      name: 'Move To',
      event: 'moveTo',
      icon: 'icon-moveto',
      conditionFunc: 'isUnit'
    },
    {
      name: 'Move Up',
      event: 'moveUp',
      icon: 'icon-moveup',
      conditionFunc: 'isFirstChild'
    },
    {
      name: 'Move Down',
      event: 'moveDown',
      icon: 'icon-movedown',
      conditionFunc: 'isLastChild'
    }
    //  ,
    //  {
    //    name: 'View Learner Progress',
    //    event: 'viewLearnerProgress'
    //  },
    //  {
    //    name: 'View Rating',
    //    event: 'viewRating'
    //  },

  ]

  /* Drag and drop */
  dragNode: ContentItemFlatNode | ContentItemNode | any;
  dragNodeExpandOverWaitTimeMs = 300;
  dragNodeExpandOverNode: any;
  dragNodeExpandOverTime!: number;
  dragNodeExpandOverArea!: string;
  @ViewChild('emptyItem') emptyItem!: ElementRef;

  dragNewElm: any;
  currentItemHtml!: HTMLElement;
  currentHoverNode = '';
  isDropAllowedFlag = false;
  messagesTranslations: any = {
    move: 'admin.facultyCourseView.treeOperationWarnings.move',
    movedSuccessfully: 'admin.facultyCourseView.successToastMessagesOnMove.movedSuccessfully',
    shuffledSuccessfully: 'admin.facultyCourseView.successToastMessagesOnMove.shuffledSuccessfully',
    up: 'admin.facultyCourseView.directions.up',
    down: 'admin.facultyCourseView.directions.down',
    into: 'admin.facultyCourseView.directions.into',
    deleteNode: 'admin.facultyCourseView.treeOperationWarnings.delete',
    proceedToDelete: "admin.facultyCourseView.treeOperationWarnings.proceedToDelete",
    stillDelete: 'admin.facultyCourseView.treeOperationWarnings.stillDelete',
    publish: 'admin.facultyCourseView.treeOperationsSuccess.publish',
    unPublish: 'admin.facultyCourseView.treeOperationsSuccess.unPublish',
    publishContent: 'admin.facultyCourseView.treeOperationsSuccess.publishContent',
    unPublishContent: 'admin.facultyCourseView.treeOperationsSuccess.unPublishContent'
  }
  deleteNodeSubsription: Subscription = new Subscription;
  // eslint-disable-next-line max-params
  constructor(
    private database: ChecklistDatabase,
    private renderer: Renderer2,
    private platform: Platform,
    private ngbModal: NgbModal,
    public activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private commonUtils: CommonUtils,
    private contentService: ContentService,
    private toastService: ToastrService,
    private dialogService: DialogService,
    public storageService: StorageService,
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
    console.log(this.treeControl, 'Tree control is');
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    database.dataChange.subscribe(data => {
      if (this.isFirstLoad) {
        this.initialData = data;
        this.isFirstLoad = false;
      }
      this.dataSource.data = [];
      this.dataSource.data = data;
      //this.treeControl.expand(this.dataSource['_flattenedData']['_value'][0]);
    });

  }

  async ngOnInit(): Promise<void> {
    await this.getMessageTranslations();
    this.activatedRoute.queryParams.subscribe(async data=>{
      data['changeStatus']? await this.togglePublish(this.getFlatNodeById(data['changeStatus'])):'';
      this.router.navigate([], {
        queryParams: {
          'changeStatus': null
        },
        queryParamsHandling: 'merge'
      });
    });

    this.deleteNodeSubsription = this.leftNavService.getDeleteNodeFromToc().subscribe((node:any) => {
      if(node){
        console.log(node);
        const flatNode = this.getFlatNodeById(node.elementId);
        this.deleteNode(flatNode);
      }
    });

    this.leftNavService.getNodeFromToc().subscribe((elementId:any) => {
      if(elementId){
        console.log(elementId);
        const flatNode = this.getFlatNodeById(elementId);
        this.clickNode(flatNode);
      }
    });
  }

  ngOnDestroy(){
    this.leftNavService.setDeleteNodeFromToc("");
    this.deleteNodeSubsription.unsubscribe();
  }

  async getMessageTranslations() {
    for (const key in this.messagesTranslations) {
      if (Object.prototype.hasOwnProperty.call(this.messagesTranslations, key)) {
        this.messagesTranslations[key] = await this.translate.get(this.messagesTranslations[key]).toPromise();
      }
    }
  }

  getLevel = (node: ContentItemFlatNode) => node.level;

  isExpandable = (node: ContentItemFlatNode) => node.expandable;

  isFolder = (node: ContentItemFlatNode) => node.type;

  getChildren = (node: ContentItemNode): ContentItemNode[] => node.children;

  // eslint-disable-next-line id-length
  hasChild = (_: number, _nodeData: ContentItemFlatNode) => _nodeData.expandable;

  // eslint-disable-next-line id-length
  hasNoContent = (_: number, _nodeData: ContentItemFlatNode) =>
    _nodeData.name === '';
  getFlatNodeById = (id: string) => this.treeControl.dataNodes.filter(data => data._id === id)[0] || null;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: ContentItemNode, level: number) => {
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
    flatNode.createdOn = node.createdOn;
    flatNode.status = node.status;
    flatNode.unPublishedContent = node.unPublishedContent;
    flatNode.isBookMarked = node.isBookMarked;
    flatNode.expandable = node.children && node.children.length > 0;
    flatNode.isLearningObjectiveLinked = node.isLearningObjectiveLinked;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: ContentItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every((child: any) =>
      this.checklistSelection.isSelected(child)
    );
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: ContentItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
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

  /** Select the category so we can insert the new item. */
  addNewItem(node: ContentItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    alert("Add children to parent with id: " + parentNode?._id + " and name: " + parentNode?.name);
    // this.database.insertItem(parentNode);
    // this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: ContentItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode, itemValue);
  }

  handleDragStart(event: any, node: any) {
    console.log('handleDragStart');
    const itemHtml = document.querySelector('#node_' + node._id) as HTMLElement;
    this.dragNewElm = this.renderer.createElement('mat-tree-node');
    // const testHtml = '<button _ngcontent-org-c93="" mat-icon-button="" disabled="true" class="mat-focus-indicator mat-icon-button mat-button-base mat-button-disabled" ng-reflect-disabled=""><span class="mat-button-wrapper">content</span><span matripple="" class="mat-ripple mat-button-ripple mat-button-ripple-round" ng-reflect-disabled="true" ng-reflect-centered="true" ng-reflect-trigger="[object HTMLButtonElement]"></span><span class="mat-button-focus-overlay"></span></button><mat-checkbox _ngcontent-org-c93="" draggable="true" class="mat-checkbox checklist-leaf-node mat-accent" ng-reflect-ng-class="[object Object]" ng-reflect-checked="false" id="mat-checkbox-9"><label class="mat-checkbox-layout" for="mat-checkbox-9-input"><span class="mat-checkbox-inner-container"><input type="checkbox" class="mat-checkbox-input cdk-visually-hidden" id="mat-checkbox-9-input" tabindex="0" aria-checked="false"><span matripple="" class="mat-ripple mat-checkbox-ripple mat-focus-indicator" ng-reflect-trigger="[object HTMLLabelElement]" ng-reflect-disabled="false" ng-reflect-radius="20" ng-reflect-centered="true" ng-reflect-animation="[object Object]"><span class="mat-ripple-element mat-checkbox-persistent-ripple"></span></span><span class="mat-checkbox-frame"></span><span class="mat-checkbox-background"><svg version="1.1" focusable="false" viewBox="0 0 24 24" xml:space="preserve" class="mat-checkbox-checkmark"><path fill="none" stroke="white" d="M4.1,12.7 9,17.6 20.3,6.3" class="mat-checkbox-checkmark-path"></path></svg><span class="mat-checkbox-mixedmark"></span></span></span><span class="mat-checkbox-label"><span style="display: none;">&nbsp;</span>Content 6 Title</span></label></mat-checkbox>';
    const testHtml = itemHtml.innerHTML;

    this.renderer.addClass(this.dragNewElm, 'cdk-tree-node');
    this.renderer.addClass(this.dragNewElm, 'mat-tree-node');
    this.renderer.setProperty(this.dragNewElm, 'id', 'draggedElement');
    this.renderer.setProperty(this.dragNewElm, 'innerHTML', testHtml);
    this.renderer.setStyle(this.dragNewElm, 'display', 'none');
    this.renderer.appendChild(document.body, this.dragNewElm);
    this.currentItemHtml = document.querySelector('#node_' + node._id) as HTMLElement;
    // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
    event.dataTransfer.setData('foo', event.target.id);
    event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
    if (this.platform.FIREFOX) {
      event.dataTransfer.effectAllowed = "none";
    }

    this.dragNode = node;
    this.treeControl.collapse(node);
  }

  handleDragOver(event: any, node: ContentItemNode | ContentItemFlatNode): void {
    event.preventDefault();
    console.log('handleDragOver', node);

    const itemHtml = document.querySelector('#draggedElement') as HTMLElement;
    const left = event.clientX;
    const top = event.clientY;

    this.currentItemHtml.style.display = 'none';
    // Handle node expand
    if (node === this.dragNodeExpandOverNode) {
      if (this.dragNode !== node && !this.treeControl.isExpanded(<ContentItemFlatNode>node)) {
        if (
          new Date().getTime() - this.dragNodeExpandOverTime >
          this.dragNodeExpandOverWaitTimeMs
        ) {
          this.treeControl.expand(<ContentItemFlatNode>node);
        }
      }
    } else {
      this.dragNodeExpandOverNode = node;
      this.dragNodeExpandOverTime = new Date().getTime();
    }

    // Handle drag area
    //const percentageX = event.offsetX / event.target.clientWidth;
    const percentageY = event.offsetY / event.target.clientHeight;

    if (percentageY < 0.25) {
      this.dragNodeExpandOverArea = 'above';
    } else if (percentageY > 0.75) {
      this.dragNodeExpandOverArea = 'below';
    } else {
      this.dragNodeExpandOverArea = 'center';
    }

    if (itemHtml) {
      itemHtml.style.position = 'absolute';
      itemHtml.style.left = (left + 10) + 'px';
      itemHtml.style.top = top + 'px';
      itemHtml.style.display = 'flex';
    }
    if (!this.currentHoverNode) {
      this.currentHoverNode = node._id;
    }
    if (this.currentHoverNode !== node._id) {
      this.unsetDragColor();
      this.currentHoverNode = node._id;
    }
    const itemHtmlInitial = document.querySelector('#node_' + node._id) as HTMLElement;
    if (!this.isDropNotAllowed(this.dragNode, this.dragNodeExpandOverArea, <ContentItemFlatNode>node)) {
      itemHtmlInitial.style.backgroundColor = '#ff596a';
      itemHtmlInitial.style.opacity = '0.2';
      itemHtmlInitial.style.background = 'repeating-linear-gradient( -45deg, #ff8686, #ff8686 5px, #e5e5f7 5px, #e5e5f7 25px )';
      this.isDropAllowedFlag = true;
      event.dataTransfer.setData('foo', 'bar');
      event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
      event.dataTransfer.effectAllowed = "none";
      event.dataTransfer.dropEffect = "none";
    } else {
      this.unsetDragColor();
    }
    // itemHtmlIntital.style.backgroundColor = 'unset';
  }

  async handleDrop(event: any, node: ContentItemFlatNode): Promise<void> {
    if (this.isDropNotAllowed(this.dragNode, this.dragNodeExpandOverArea, <ContentItemFlatNode>node)) {
      event.preventDefault();
      console.log(
        this.dragNodeExpandOverArea,
        this.flatNodeMap.get(this.dragNode),
        this.flatNodeMap.get(<ContentItemFlatNode>node),
        this.getLevel(this.dragNode)
      );
      if (node !== this.dragNode) {
        let newNode: ContentItemNode;
        let targetParent: ContentItemFlatNode;
        if (this.dragNodeExpandOverArea === 'above' && this.dragNode !== undefined) {
          targetParent = this.getParent(node);
          console.log('******Above');
          newNode = this.database.copyPasteItemAbove(
            this.flatNodeMap.get(this.dragNode)!,
            this.flatNodeMap.get(<ContentItemFlatNode>node)!
          );
        } else if (this.dragNodeExpandOverArea === 'below') {
          targetParent = this.getParent(node);
          newNode = this.database.copyPasteItemBelow(
            this.flatNodeMap.get(this.dragNode)!,
            this.flatNodeMap.get(<ContentItemFlatNode>node)!
          );
        } else {
          targetParent = node;
          newNode = this.database.copyPasteItem(
            this.flatNodeMap.get(this.dragNode)!,
            this.flatNodeMap.get(<ContentItemFlatNode>node)!
          );
        }
        console.log(newNode);
        const sourceParent = this.getParent(this.dragNode);

        this.database.deleteItem(this.flatNodeMap.get(this.dragNode)!);
        this.updateUnpublishedContent(sourceParent);
        this.updateUnpublishedContent(targetParent);
        try {
          this.contentService.moveTo(this.database.dataChange['_value'], this.findIndex(newNode), sourceParent, targetParent, newNode._id, this.courseId);
        } catch (error: any) {
          const message = error.message;
          await this.dialogService.showAlertDialog({title: {translationKey: message},type: DialogTypes.ERROR});
          window.location.reload();
        }
        sourceParent === targetParent?
          this.showSuccessToast(`${newNode.name} ${this.messagesTranslations.movedSuccessfully}`):
          this.showSuccessToast(`${newNode.name} ${this.messagesTranslations.movedSuccessfully} ${this.messagesTranslations.into} ${targetParent?targetParent.name : 'course'}`);
        //this.treeControl.expandDescendants(this.nestedNodeMap.get(newItem)!);
      }
      this.dragNode = null;
      this.dragNodeExpandOverNode = null;
      this.dragNodeExpandOverTime = 0;
      console.log(this.database);
      this.dragNewElm.remove();
      this.unsetDragColor();
    }
    this.currentItemHtml.style.display = 'flex';
  }

  async deleteNode(node: ContentItemFlatNode) {
    const nodeDetails = this.flatNodeMap.get(node)!;
    const childLength = nodeDetails.children.length;
    let message :string;
    if (node.type.toLowerCase() === "unit" && childLength > 0) {
      message = `${node.type.toUpperCase()} has ${childLength} files already present. All the files in the ${node.type} will be deleted. ${this.messagesTranslations.stillDelete}`;
    } else if (node.type.toLowerCase() === "folder" && childLength > 0){
      message = `Deleting this ${node.type} will delete  all ${childLength} files it contains. ${this.messagesTranslations.proceedToDelete}`;
    } else if(node.type.toLowerCase() === 'otherattachements'){
      message = `${this.messagesTranslations.deleteNode} this other attachment?`;
    }else {
      message = `${this.messagesTranslations.deleteNode} this ${node.type}?`;
    }
    const confirmation = await this.dialogService.showConfirmDialog({title: {translationKey: message}});
    if (!confirmation) {
      return;
    }
    const parentNode = this.getParent(node);
    try {
      await this.contentService.deleteNode(parentNode,node._id,this.courseId);
      this.database.deleteItem(this.flatNodeMap.get(node)!);
    }catch (error:any) {
      const message = error.message;
      await this.dialogService.showAlertDialog({title: {translationKey: message},type: DialogTypes.ERROR});
      window.location.reload();
    }
    this.showSuccessToast(`${this.capitalizeFirstLetter(node.type)} Deleted Successfully`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDragEnd(event: any) {
    console.log('handle drag end');
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
    this.dragNewElm.remove();
    this.currentItemHtml.style.display = 'flex';
    this.unsetDragColor();
  }

  capitalizeFirstLetter(text:string):string{
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  unsetDragColor(): void {
    const itemHtmlPrev = document.querySelector('#node_' + this.currentHoverNode) as HTMLElement;
    itemHtmlPrev.style.backgroundColor = 'unset';
    itemHtmlPrev.style.opacity = '1';
    itemHtmlPrev.style.background = '';
    this.isDropAllowedFlag = false;
  }

  isFirstChild(node: ContentItemFlatNode): boolean {
    const siblings = this.getChildrenBasedOnPosition(node, 'above');
    if (siblings[0] === node) {
      return true;
    }
    return false;
  }

  isLastChild(node: ContentItemFlatNode): boolean {
    const siblings = this.getChildrenBasedOnPosition(node, 'bellow');
    if (siblings[siblings.length - 1] === node) {
      return true;
    }
    return false;
  }

  clickNode(node: ContentItemFlatNode) {
    if(node.type === ContentType.DISCUSSION_FORUM) {
      this.router.navigate(['../../discussion-forums/forum-detail/' + node._id], { relativeTo: this.activatedRoute, queryParamsHandling: 'merge' });
    } else {
      this.router.navigate(['./content/' + node._id], { relativeTo: this.activatedRoute, queryParams: { toc: true }, queryParamsHandling: 'merge' });
      this.leftNavService.messageEmitter.next(true);
      this.leftNavService.nodeDetailsEmitter.next(node._id);
    }
  }

  async togglePublish(node: ContentItemFlatNode){
    try {
      const element = this.flatNodeMap.get(node)!;
      switch (node.status) {
        case ElementStatuses.PUBLISHED:{
          element.status = ElementStatuses.UNPUBLISHED;
          let dialog: Dialog;
          if (node.type === 'unit' || node.type === 'folder') {
            dialog = {title: {translationKey: "admin.facultyCourseView.treeOperationWarnings.unpublish",translateArgs: { type: node.type}}};
          }
          else{
            dialog = {title: {translationKey: "admin.facultyCourseView.treeOperationWarnings.unpublishContent"}};
          }
          const confirmation = await this.dialogService.showConfirmDialog(dialog);
          if (confirmation) {
            await this.contentService.unPublish(this.courseId,node._id);
            element.status = ElementStatuses.UNPUBLISHED;
            if (node.type === 'unit' || node.type === 'folder') {
              element.unPublishedContent = true;
            }
            const func = (element:ContentItemNode)=>{
              element['status']=ElementStatuses.UNPUBLISHED;
              if (node.type === 'unit' || node.type === 'folder') {
                element.unPublishedContent = true;
              }
            };
            this.contentService.iterateElementAndDoOperation(element.children,func);
            this.database.refreshTree();
            if(node.type === "folder" || node.type==="unit"){
              this.showSuccessToast(`${this.messagesTranslations.unPublish}`);
              return;
            }
            this.showSuccessToast(`${this.messagesTranslations.unPublishContent}`);
          }
          else{
            // eslint-disable-next-line require-atomic-updates
            element.status = ElementStatuses.PUBLISHED;
          }
        }
          break;
        case ElementStatuses.UNPUBLISHED:{
          const parentNode = this.getParent(node);
          if (parentNode && parentNode.status===ElementStatuses.UNPUBLISHED) {
            element.status = ElementStatuses.UNPUBLISHED;
            await this.dialogService.showAlertDialog({type: DialogTypes.ERROR,title: {translationKey: "admin.facultyCourseView.treeOperationErrors.publishChildWhenParentUnpublished",translateArgs: { type: parentNode.type}}});
            this.database.refreshTree();
            break;
          }
          if (node.type === 'unit' || node.type === 'folder') {
            const modalConfig: Dialog = {
              type: DialogTypes.SINGLESELECT,
              title: {
                translationKey: 'admin.facultyCourseView.treeOperationWarnings.publish.dialogTitle',
                translateArgs: {type: node.type}},
              options: [
                {
                  operation: "publishWithChild",
                  title: {
                    translationKey: "admin.facultyCourseView.treeOperationWarnings.publish.dialogOptions.publishWithChild",
                    translateArgs: { type: node.type}
                  },
                  disable: !node.expandable
                },
                {
                  operation: "publishWithoutChild",
                  title: {
                    translationKey: "admin.facultyCourseView.treeOperationWarnings.publish.dialogOptions.publishWithoutChild",
                    translateArgs: { type: node.type}
                  }
                }
              ],
              ngbModelOptions: {modalDialogClass: 'selection-modal-dialog modal-dialog-centered'
              }
            };
            const response = await this.dialogService.showSelectionDialog(modalConfig);
            if (response) {
              element.status = "published";
              // eslint-disable-next-line max-depth
              switch (response.operation) {
                case 'publishWithChild':{
                  await this.contentService.publish(this.courseId,node._id,false);
                  // eslint-disable-next-line max-depth
                  if (node.type === 'unit' || node.type === 'folder') {
                    element.unPublishedContent = false;
                  }
                  const func = (element:ContentItemNode)=>{
                    element['status']=ElementStatuses.PUBLISHED;
                    if (node.type === 'unit' || node.type === 'folder') {
                      element.unPublishedContent = false;
                    }
                  };
                  this.contentService.iterateElementAndDoOperation(element.children, func );
                }
                  break;
                case 'publishWithoutChild':{
                  await this.contentService.publish(this.courseId,node._id,true);
                }
                  break;
                default:
                  break;
              }
              this.showSuccessToast(`${this.messagesTranslations.publish}`);
            }else{
              element.status = "unpublished";
            }
          }
          else{
            const dialog = {title: {translationKey: "admin.facultyCourseView.treeOperationWarnings.publishContent"}};
            const confirmation = await this.dialogService.showConfirmDialog(dialog);
            if (confirmation) {
              await this.contentService.publish(this.courseId,node._id,true);
              element.status = ElementStatuses.PUBLISHED;
              this.contentService.iterateElementAndDoOperation(element.children, (element:ContentItemNode)=>element['status']='unpublished' );
              this.database.refreshTree();
              this.showSuccessToast(`${this.messagesTranslations.publishContent}`);
            }
            else{
            // eslint-disable-next-line require-atomic-updates
              element.status = ElementStatuses.UNPUBLISHED;
            }
          }
        }
          break;
      }
      this.database.refreshTree();
      this.updateUnpublishedContent(node);
    } catch (error:any) {
      if (error.status !== 409) {
        const message = error.message;
        await this.dialogService.showAlertDialog({title: {translationKey: message},type: DialogTypes.ERROR});
      }
     
    }
  }

  moveTo(node: ContentItemFlatNode) {
    const modelRef = this.ngbModal.open(LocationSelectionComponent, { backdrop: 'static', size: 'lg', centered: true, modalDialogClass: 'content-builder-modal', animation: true });
    modelRef.componentInstance.payload = { type: 'moveTo', node: node };
    modelRef.componentInstance.modalConfig.cancelBtn = 'admin.facultyCourseView.locationModal.cancelBtn';
    modelRef.componentInstance.modalConfig.confirmBtn = 'admin.facultyCourseView.locationModal.confirmBtn';
    modelRef.componentInstance.confirmStatus.subscribe(async (data: any) => {
      modelRef.close();
      if (!data.type) {
        return;
      }
      const message = `${this.messagesTranslations.move} ${node.name} ${this.messagesTranslations.into} ${data.node.name}`;
      const confirmation = await this.dialogService.showConfirmDialog({title: {translationKey: message}});
      if (confirmation) {
        if (data.type) {
          let newNode: ContentItemNode;
          let parentNode: any = null;
          if (data.node.type === 'course') {
            const rootNode = this.treeControl.dataNodes.filter(node => node.level === 0);
            const lastNode = rootNode[rootNode.length - 1];
            newNode = this.database.copyPasteItemBelow(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this.flatNodeMap.get(node)!, this.flatNodeMap.get(lastNode)!
            );
          }
          else {
            parentNode = this.treeControl.dataNodes.filter(node => node._id === data.node._id)[0];
            newNode = this.database.copyPasteItem(
              this.flatNodeMap.get(node)!,
              this.flatNodeMap.get(parentNode)!
            );
          }
          const sourceParent = this.getParent(node);
          this.database.deleteItem(this.flatNodeMap.get(node)!);
          this.updateUnpublishedContent(sourceParent);
          this.updateUnpublishedContent(parentNode);
          try {
            this.contentService.moveTo(this.database.dataChange['_value'], this.findIndex(newNode), sourceParent, parentNode, newNode._id, this.courseId);
          } catch (error: any) {
            const message = error.message;
            await this.dialogService.showAlertDialog({title: {translationKey: message},type: DialogTypes.ERROR});
            window.location.reload();
          }
          this.showSuccessToast(`${newNode.name} ${this.messagesTranslations.movedSuccessfully} ${this.messagesTranslations.into} ${parentNode ? parentNode.name : 'course'}`);
        }
      }
    });
  }
  async moveNode(node: ContentItemFlatNode, direction: string): Promise<void> {
    const message = `${this.messagesTranslations.move} ${node.type} ${direction}`;
    const confirmation = await this.dialogService.showConfirmDialog({title: {translationKey: message}});
    if (!confirmation) {
      return;
    }
    // console.log('Moving up ', event,node, this.getParent(node), 'databas is', this.dataSource);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const siblings = <any>this.getChildrenBasedOnPosition(node, 'aboveOrBellow');
    //console.log('Siblings are ', siblings);

    for (let i = 0; i < siblings.length; i++) {
      //console.log('From ', node.name, 'To ', siblings[i].name);
      if (node.name === siblings[i].name) {
        console.log('Found');
        let newNode;
        if (direction === 'up') {
          const j = i - 1;

          //console.log('Moving above ', siblings[j], 'node is', node);

          newNode = this.database.copyPasteItemAbove(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.flatNodeMap.get(node)!, this.flatNodeMap.get(siblings[j])!
          );
        } else {
          const j = i + 1;
          newNode = this.database.copyPasteItemBelow(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.flatNodeMap.get(node)!, this.flatNodeMap.get(siblings[j])!
          );
        }
        const sourceParent = this.getParent(node);
        this.database.deleteItem(this.flatNodeMap.get(node)!);
        try {
          this.contentService.moveTo(this.database.dataChange['_value'], this.findIndex(newNode), sourceParent, sourceParent, newNode._id, this.courseId);
        } catch (error: any) {
          const message = error.message;
          await this.dialogService.showAlertDialog({title: {translationKey: message},type: DialogTypes.ERROR});
          window.location.reload();
        }
        this.showSuccessToast(`${newNode.name} ${this.messagesTranslations.movedSuccessfully} ${this.messagesTranslations[direction]}`);
      }
    }
  }

  // eslint-disable-next-line max-lines-per-function
  checkExistence(childNodes: ContentItemFlatNode[], fromNode: ContentItemFlatNode): boolean {
    for (let i = 0; i < childNodes.length; i++) {
      console.log('From ', fromNode.name, 'To ', childNodes[i].name);
      if (fromNode.name + fromNode.type === childNodes[i].name + childNodes[i].type) {
        console.log('REturning');
        return true;
      }
    }
    return false;
  }

  getChildrenBasedOnPosition(node: any, placement: string): ContentItemFlatNode[] {
    const parentNodeTo = this.getParent(node);
    if (placement === 'center') {
      console.log('In center placement');

      return this.treeControl.getDescendants(node).filter(data => (data.level) === (node.level + 1));
    }
    else if (parentNodeTo === null) {
      //   console.log('Sending nodes');

      return this.treeControl.dataNodes.filter(node => node.level === 0);
    }

    if (parentNodeTo !== null) {
      return this.treeControl.getDescendants(parentNodeTo).filter(data => (data.level) === (parentNodeTo.level + 1));
    }

    return [];
  }

  isDropNotAllowed(fromNode: ContentItemFlatNode, placement: string, toNode: ContentItemFlatNode): boolean {
    console.log('in dropppppp');

    const parentNodeTo = this.getParent(toNode);
    const parentNodeFrom = this.getParent(fromNode);
    console.log('from parent, ', parentNodeFrom, ' To ', parentNodeTo);

    let childNodes = null;
    /** Dragging outside immediate parent not allowed*/
    // if (parentNodeTo !== parentNodeFrom && fromNode.type !== 'unit') {
    //   return false;
    // }

    /** dragging publish to unpublished*/
    if ((parentNodeTo === null && placement === 'center') || parentNodeTo !== null) {
      if (fromNode.status === ElementStatuses.PUBLISHED && placement === 'center' && toNode.status !== ElementStatuses.PUBLISHED) {
        return false;
      }
      if (fromNode.status === ElementStatuses.PUBLISHED && placement !== 'center' && parentNodeTo.status !== ElementStatuses.PUBLISHED) {
        return false;
      }
    }

    /** shuffling the elements*/
    if (parentNodeTo === parentNodeFrom && placement !== 'center') {
      return true;
    }
    
    const restrictionType = this.restrictionRules[placement][fromNode.type];
    if (typeof restrictionType !== 'undefined' && restrictionType.includes(toNode.type)) {
      return false;
    }

    /**moving the elements */
    childNodes = this.getChildrenBasedOnPosition(toNode, placement);
    console.log('Main node level', toNode.level, 'Child nodes are', childNodes);
    return !this.checkExistence(childNodes, fromNode);
  }
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
  applyStyles(node: any) {
    const styles = { 'padding-left': node.level * 40 + 'px' };
    return styles;
  }

  applyStylesForMoreInfo(node: any) {
    const styles = { 'padding-left': node.level * 40 + 130 + 'px' };
    return styles;
  }

  getNodeIconType(node: ContentItemFlatNode) {
    if(node.type === ContentType.DISCUSSION_FORUM) {
      return node.subContentType;
    }
    return node.type;
  }

  async toggleBookmark(node: ContentItemFlatNode) {
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

  treeOperations(event: string, node: ContentItemFlatNode): void {
    switch (event) {
      case TreeOperations.DELETE:
        this.deleteNode(node);
        break;
      case TreeOperations.EDIT: {
        const type = node.type;
        this.router.navigate(['./manipulate/edit/' + type + '/' + node._id], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
        break;
      }
      case TreeOperations.MOVEDOWN:
        this.moveNode(node, 'down');
        break;
      case TreeOperations.MOVEUP:
        this.moveNode(node, 'up');
        break;
      case TreeOperations.MOVETO:
        this.moveTo(node);
        break;
      case TreeOperations.ADDASBOOKMARK:
        this.toggleBookmark(node);
        break;
      case TreeOperations.ADD_LEARNING_OBJECTIVE:
      case TreeOperations.View_LEARNING_OBJECTIVE:
        this.AddLearningObjective(node,event);
        break;
      default:
        break;
    }
  }

  async AddLearningObjective(node:any,event:string){
    this.storageService.set(StorageKey.ELEMENT_DETAIL,node);
    let confirmation = true;
    if(node.type==='folder' || node.type==='unit' ){
      confirmation = await this.dialogService.showConfirmDialog({title: {translationKey: 'admin.facultyCourseView.treeOperationWarnings.addLearningObjective'}});
    }
    if(confirmation){
      this.router.navigate(['./add-learning-objective/' + node.type + '/' + node._id+'/'+event], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
    }
  }
  
  displayContextMenuItem(event: string, node: ContentItemFlatNode) {
    switch (event) {
      case TreeOperations.MOVEDOWN:
        return !this.isLastChild(node);
      case TreeOperations.MOVEUP:
        return !this.isFirstChild(node);
      case TreeOperations.MOVETO:
        return !(node.type === 'unit');
      case TreeOperations.ADDASBOOKMARK:
        return !node.isBookMarked;
      case TreeOperations.View_LEARNING_OBJECTIVE:
        return node.isLearningObjectiveLinked;
      case TreeOperations.ADD_LEARNING_OBJECTIVE:
        return !node.isLearningObjectiveLinked;
      default:
        return true;
    }
  }
  findIndex(newNode: ContentItemNode): number {
    const node: ContentItemFlatNode = this.nestedNodeMap.get(newNode)!;
    const siblingsNode = this.getChildrenBasedOnPosition(node, 'above');
    return siblingsNode.findIndex(data => data._id === node._id);
  }
  showSuccessToast(message: string) {
    this.toastService.success(message, '', {
      positionClass: 'toast-top-right',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
  }

  async toggleMoreInfo(node: any) {
    if (this.moreInfo !== node.name) {
      const responce = await this.contentService.getElementDetailsForMoreInfo(this.courseId, node._id);
      if(responce.body && responce.body.description && responce.body.description.length > 480){
        this.viewMore = true;
        this.description = this.sanitizer.bypassSecurityTrustHtml(responce.body.description.substr(0, 480));
      }else{
        responce.body.description = responce.body.description === null || responce.body.description === ""? "<p style=\"color:#FF6600;\">No Description Available</p>": responce.body.description;
        this.description = this.sanitizer.bypassSecurityTrustHtml(responce.body.description);
        this.viewMore = false;
      }
      this.lastAccessedTime = responce.body.lastAccessedTime;
      if (this.lastAccessedTime) {
        this.lastAccessedTime = this.commonUtils.timestampToDate(this.lastAccessedTime);
      }
      this.moreInfo = node.name;
    }
    else {

      this.moreInfo = "";
    }
  }

  updateUnpublishedContent(node: ContentItemFlatNode): void {
    if (!node) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const nestedNode = this.flatNodeMap.get(node)!;
    if (!node.expandable) {
      // eslint-disable-next-line max-lines
      nestedNode.unPublishedContent = false;
    }
    const childContentNodes = this.treeControl.getDescendants(node);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const nestedParentNode = this.flatNodeMap.get(node)!;
    nestedParentNode.unPublishedContent = childContentNodes.filter(element => element.status === ElementStatuses.UNPUBLISHED).length > 0;
    const parentNode = this.getParent(node);
    if (parentNode) {
      this.updateUnpublishedContent(parentNode);
    }
    this.database.refreshTree();
  }
}
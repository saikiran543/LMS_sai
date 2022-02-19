import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DialogTypes } from 'src/app/enums/Dialog';
import { ElementStatuses } from 'src/app/enums/ElementStatuses';
import { StorageKey } from 'src/app/enums/storageKey';
import { ContentItemFlatNode, ContentItemNode } from 'src/app/model';
import { DialogService } from 'src/app/services/dialog.service';
import { StorageService } from 'src/app/services/storage.service';
@Component({
  selector: 'app-location-selection',
  templateUrl: './location-selection.component.html',
  styleUrls: ['./location-selection.component.scss']
})
export class LocationSelectionComponent {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeNode: any;
  message = '';
  confirmBtn = '';
  cancelBtn = '';
  isExpand!:boolean;
  isExpandable!:boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalConfig = {
    message: 'locationSelectionModal.text',
    confirmBtn: 'locationSelectionModal.confirmButton',
    cancelBtn: 'locationSelectionModal.cancelButton'
  };

  courseDetails : ContentItemFlatNode= {
    name: 'Crash Course in Account & Finance',
    _id: '1142',
    type: 'course',
    level: 0,
    status: '',
    expandable: false,
    progress: 0,
    title: '',
    elementId: '',
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any = {}
  @Output() confirmStatus = new EventEmitter();

  private _transformer = (node: ContentItemNode, level: number) => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flatNode: ContentItemFlatNode = {
      _id: node._id,
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      type: node.type,
      disableType: '',
      status: node.status,
      progress: node.progress,
      title: node.title,
      elementId: node.elementId
    };

    return flatNode;
  }

  treeControl = new FlatTreeControl<ContentItemFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    // eslint-disable-next-line no-invalid-this
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  // eslint-disable-next-line no-invalid-this
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private translate: TranslateService, private ngbModal: NgbModal,private storageService : StorageService, private dialogService: DialogService) {

  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, id-length
  hasChild = (_: number, node: ContentItemFlatNode) => node.expandable;

  ngOnInit(): void {
    this.initTexts();
    this.isExpand = true;
    this.storageService.listen(StorageKey.COURSE_JSON).subscribe(res => {
      this.initializeTree(res);
    });
    this.courseDetails._id = this.params.coureId;
    this.isExpandable = this.checkIsTreeExpandable();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  checkIsTreeExpandable(){
    if (this.params.type === 'unit') {
      return false;
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  buildFileTree(obj: any, level: number): ContentItemNode[] {
    return Object.keys(obj).reduce<ContentItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new ContentItemNode();
      node._id = value.elementId;
      node.name = value.name;
      node.status = value.status;
      node.type = value.type;
      if (value !== null) {
        if (typeof value === 'object' && value.childElements) {
          node.children = this.buildFileTree(value.childElements, level + 1);
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private initializeTree(data:any) {
    this.dataSource.data = data;
    this.treeControl.expandAll();
    if(this.payload.type==='moveTo'){
      let fromNode: ContentItemFlatNode;
      if (this.payload.node !== undefined) {
        fromNode = {
          _id: this.payload.node._id,
          name: this.payload.node.name,
          level: this.payload.node.level,
          type: this.payload.node.type,
          expandable: this.payload.node.expandable,
          disableType: '',
          status: this.payload.node.status,
          progress: this.payload.node.progress,
          title: this.payload.node.title,
          elementId: this.payload.node.elementId

        };
        this.treeControl.dataNodes.forEach(node => {
          node.disableType = this.isDropAllowed(fromNode, 'center', node);
          node.expandable = this.checkIfFolderHasFolder(node);
        });
        const fromNodeOfCurrentTree = this.treeControl.dataNodes.filter(node => node._id === fromNode._id)[0];
        this.treeControl.getDescendants(fromNodeOfCurrentTree).map(node => node.disableType = 'ownChild');
        const firstRootNode = this.treeControl.dataNodes.filter(node => node.level === 0)[0];
        this.courseDetails.disableType = this.isDropAllowed(fromNode, 'below', firstRootNode);
      }
    }
    else{
      this.treeControl.dataNodes.forEach(node => {
        node.expandable = this.checkIfFolderHasFolder(node);
      });
    }
  }

  checkIfFolderHasFolder(node: ContentItemFlatNode): boolean {
    const childNodes: ContentItemFlatNode[] = this.getChildrenBasedOnPosition(node, 'center');
    return childNodes.filter((data: ContentItemFlatNode) => data.type === 'folder').length > 0;
  }

  initTexts(): void {
    if (this.modalConfig.message) {
      this.translate.get(this.modalConfig.message).subscribe(val => {
        this.message = val;
      });
    }
    if (this.modalConfig.confirmBtn) {
      this.translate.get(this.modalConfig.confirmBtn).subscribe(val => {
        this.confirmBtn = val;
      });
    }
    if (this.modalConfig.cancelBtn) {
      this.translate.get(this.modalConfig.cancelBtn).subscribe(val => {
        this.cancelBtn = val;
      });
    }
  }
  sendConfirmStatus(value: boolean): void {
    const payload = { type: value, node: this.activeNode };
    this.confirmStatus.emit(payload);
  }

  isDropAllowed(fromNode: ContentItemFlatNode, placement: string, toNode: ContentItemFlatNode): string {
    // console.log('in dropppppp');
    if (fromNode._id === toNode._id) {
      return 'same';
    }

    const parentNodeTo = this.getParent(toNode);
    const parentNodeFrom = this.getParent(fromNode);
    // console.log('from parent, ',parentNodeFrom, ' To ', parentNodeTo);

    let childNodes = null;
    /** dragging publish to unpublished*/
    if((parentNodeTo===null && placement === 'center')|| parentNodeTo !==null ){
      if (fromNode.status === ElementStatuses.PUBLISHED && placement === 'center' && toNode.status !== ElementStatuses.PUBLISHED) {
        return 'unpublishedParent';
      }
      if (fromNode.status === ElementStatuses.PUBLISHED && placement !== 'center' && parentNodeTo.status !== ElementStatuses.PUBLISHED) {
        return 'unpublishedParent';
      }
    }

    /** shuffling the elements*/
    if (parentNodeTo === parentNodeFrom && placement!=='center') {
      // console.log('Truingggg');
      return 'sameName';
    }

    // const restrictionType = restrictionRules[placement][fromNode.type];
    // if (typeof restrictionType !== 'undefined' && restrictionType.includes(toNode.type)) {
    //   return false;
    // }

    /**moving the elements */
    childNodes = this.getChildrenBasedOnPosition(toNode, placement);
    // console.log('Main node level', toNode.level, 'Child nodes are', childNodes);
    return this.checkExistence(childNodes, fromNode) ? 'sameName' : '';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  getChildrenBasedOnPosition(node: any, placement: string): ContentItemFlatNode[] {
    const parentNodeTo = this.getParent(node);
    if (placement === 'center') {
      return this.treeControl.getDescendants(node).filter(data => (data.level) === (node.level + 1));
    }
    else if (parentNodeTo === null) {
      return this.treeControl.dataNodes.filter(node => node.level === 0);
    }

    if (parentNodeTo !== null) {
      return this.treeControl.getDescendants(parentNodeTo).filter(data => (data.level) === (parentNodeTo.level + 1));
    }

    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  checkExistence(childNodes: any, fromNode: any): boolean {
    for (let i = 0; i < childNodes.length; i++) {
      // console.log('From ', fromNode.name, 'To ', childNodes[i].name);
      if (fromNode.name+fromNode.type === childNodes[i].name+childNodes[i].type) {
        // console.log('REturning');
        return true;
      }
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async selectNodeToMoveInto(node: ContentItemFlatNode): Promise<void | null> {
    if (node.disableType === 'same' || node.disableType === 'ownChild') {
      // eslint-disable-next-line no-useless-return
      return;
    }
    else if (node.disableType === 'sameName') {
      //open popup
      const sameName = await this.translate.get('admin.facultyCourseView.treeOperationErrors.sameName').toPromise();
      const message = `${sameName} ${node.type}.`;
      await this.dialogService.showAlertDialog({title: { translationKey: message}, type: DialogTypes.ERROR});
    }
    else if (node.disableType === 'unpublishedParent') {
      //open popup
      const sameName = await this.translate.get('admin.facultyCourseView.treeOperationErrors.unpublishedParent').toPromise();
      const message = ` ${node.type} ${sameName}.`;
      await this.dialogService.showAlertDialog({title: { translationKey: message}, type: DialogTypes.ERROR});
    }
    else {
      this.activeNode = node;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getCourseExpandCollapseIcon(){
    if (!this.isExpandable) {
      return "assets/images/icons/content-builder/icon-nothingtoexpand.svg";
    }
    if (this.isExpand) {
      return 'assets/images/icons/content-builder/icon-collapse.svg';
    }
    return 'assets/images/icons/content-builder/icon-expand.svg';
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  applyStyles(node: any) {
    const styles = { 'padding': '20px '+ (node.level+1) * 16 + 'px'};
    return styles;
  }
}

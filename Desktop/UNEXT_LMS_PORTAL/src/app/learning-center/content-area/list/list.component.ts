/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { StorageKey } from 'src/app/enums/storageKey';
import { ContentItemNode } from 'src/app/model';
import { StorageService } from 'src/app/services/storage.service';
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<any>([]);

  get data(): ContentItemNode[] {
    return this.dataChange.value;
  }

  constructor(private storageService: StorageService) {
    this.initialize();
  }

  initialize(): void {
    // Build the tree nodes from Json object. The result is a list of `ContentItemNode` with nested
    this.storageService.listen(StorageKey.COURSE_JSON).subscribe(res => {
      this.dataChange.next(res);
    });
  }

  /** Add an item to to-do list */
  insertItem(parent: ContentItemNode | any, from: ContentItemNode): ContentItemNode {
    if (!parent.children) {
      parent.children = [];
    }
    // const newItem = { _id: id, name: name } as TodoItemNode;
    const newItem = new ContentItemNode();
    newItem._id = from._id;
    newItem.name = from.name;
    newItem.type = from.type;
    newItem.createdOn = from.createdOn;
    newItem.status = from.status;
    newItem.unPublishedContent = from.unPublishedContent;
    newItem.children = [];
    parent.children.push(newItem);
    this.dataChange.next(this.data);
    return newItem;
  }
  // call to service

  insertItemAbove(to: ContentItemNode, from: ContentItemNode): ContentItemNode {
    console.log('above', to);
    const parentNode = this.getParentFromNodes(to);
    // const newItem = { _id: from._id, name: from.name } as TodoItemNode;
    const newItem = new ContentItemNode();
    newItem._id = from._id;
    newItem.name = from.name;
    newItem.type = from.type;
    newItem.createdOn = from.createdOn;
    newItem.status = from.status;
    newItem.unPublishedContent = from.unPublishedContent;
    newItem.children = [];
    newItem.isBookMarked = from.isBookMarked;
    if (parentNode !== null) {
      parentNode.children.splice(parentNode.children.indexOf(to), 0, newItem);
    } else {
      this.data.splice(this.data.indexOf(to), 0, newItem);
    }
    this.dataChange.next(this.data);
    return newItem;
  }

  insertItemBelow(to: ContentItemNode, from: ContentItemNode): ContentItemNode {
    console.log('below', to);
    const parentNode = this.getParentFromNodes(to);
    // const newItem = { _id: from._id, name: from.name } as TodoItemNode;
    const newItem = new ContentItemNode();
    newItem._id = from._id;
    newItem.name = from.name;
    newItem.type = from.type;
    newItem.createdOn = from.createdOn;
    newItem.unPublishedContent = from.unPublishedContent;
    newItem.status = from.status;
    newItem.children = [];
    if (parentNode !== null) {
      parentNode.children.splice(
        parentNode.children.indexOf(to) + 1,
        0,
        newItem
      );
    } else {
      this.data.splice(this.data.indexOf(to) + 1, 0, newItem);
    }
    this.dataChange.next(this.data);
    return newItem;
  }

  getParentFromNodes(node: ContentItemNode): ContentItemNode | null {
    for (let i = 0; i < this.data.length; ++i) {
      const currentRoot = this.data[i];
      const parent = this.getParent(currentRoot, node);
      if (parent !== null) {
        return parent;
      }
    }
    return null;
  }

  getParent(currentRoot: ContentItemNode, node: ContentItemNode): ContentItemNode | null {
    if (currentRoot.children && currentRoot.children.length > 0) {
      for (let i = 0; i < currentRoot.children.length; ++i) {
        const child = currentRoot.children[i];
        if (child === node) {
          return currentRoot;
        } else if (child.children && child.children.length > 0) {
          const parent = this.getParent(child, node);
          if (parent !== null) {
            return parent;
          }
        }
      }
    }
    return null;
  }

  updateItem(node: ContentItemNode | any, name: string): void {
    node.name = name;
    this.dataChange.next(this.data);
  }

  deleteItem(node: ContentItemNode): void {
    this.deleteNode(this.data, node);
    this.dataChange.next(this.data);
  }

  copyPasteItem(from: ContentItemNode, to: ContentItemNode): ContentItemNode {
    const newItem = this.insertItem(to, from);
    if (from.children) {
      from.children.forEach(child => {
        this.copyPasteItem(child, newItem);
      });
    }
    return newItem;
  }

  copyPasteItemAbove(from: ContentItemNode, to: ContentItemNode): ContentItemNode {
    console.log('To node is ,', to);

    const newItem = this.insertItemAbove(to, from);
    if (from.children) {
      from.children.forEach(child => {
        this.copyPasteItem(child, newItem);
      });
    }
    return newItem;
  }

  copyPasteItemBelow(from: ContentItemNode, to: ContentItemNode): ContentItemNode {
    const newItem = this.insertItemBelow(to, from);
    if (from.children) {
      from.children.forEach(child => {
        this.copyPasteItem(child, newItem);
      });
    }
    return newItem;
  }

  deleteNode(nodes: ContentItemNode[], nodeToDelete: ContentItemNode): void {
    const index = nodes.indexOf(nodeToDelete, 0);
    if (index > -1) {
      nodes.splice(index, 1);
    } else {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          this.deleteNode(node.children, nodeToDelete);
        }
      });
    }
  }

  refreshTree() :void{
    this.dataChange.next(this.data);
  }
}
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  view!: string;
  isPreview = false;
  isContentPlayerLoaded= false;
  courseId! : string;

  constructor(public activatedRoute: ActivatedRoute, public storageService:StorageService) {
    this.showPreview();
    this.initializeView();
    this.activatedRoute.parent?.params.subscribe((params:any)=>{
      this.courseId= params.courseId;
    });
  }

  initializeView(): void {
    this.view = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    this.storageService.listen('previewMode').subscribe((data)=>{
      this.isContentPlayerLoaded = data;
    });
  }

  private showPreview() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.activatedRoute.queryParams.subscribe(res => {
      if (res && res.preview && res.preview === 'true') {
        this.isPreview = true;
        this.storageService.set('previewMode',true);
      }
      else if(this.isPreview !== false){
        this.isPreview = false;
        this.storageService.set('previewMode',false);
      }
    });
  }
}

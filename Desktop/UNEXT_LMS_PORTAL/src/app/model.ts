/**
 * Node for content item
 */
export class ContentItemNode {
    _id!: string;
    children!: ContentItemNode[];
    name!: string;
    type!: string;
    createdOn?: Date;
    status!: string;
    progress!: number;
    idealTime?: number;
    contentStatus?:string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    elementMetadata?: any;
    isBookMarked?: boolean;
    title!: string;
    elementId!: string;
    numberOfContent?: number;
    completedContent?: number;
    unPublishedContent?:boolean;
    isLearningObjectiveLinked?:boolean;
}
  
/** Flat content item node with expandable and level information */
export class ContentItemFlatNode {
    _id!: string;
    name!: string;
    level!: number;
    status!:string
    expandable!: boolean;
    type!: string;
    subContentType?: string;
    createdOn?: Date;
    disableType?: string;
    progress!: number;
    idealTime?: number;
    contentStatus?:string;
    isBookMarked?: boolean;
    allowDownload?: boolean;
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     elementMetadata?: any;
     title!: string;
     elementId!: string;
     numberOfContent?: number;
     completedContent?: number;
     unPublishedContent?:boolean;
     isLearningObjectiveLinked?:boolean;
}
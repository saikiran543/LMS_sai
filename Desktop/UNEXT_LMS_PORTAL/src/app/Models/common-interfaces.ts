/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpHeaders } from "@angular/common/http";

export interface IResponse{
    body: IBodyList & IBodyCommon & IBodyDelete;
    headers: HttpHeaders | {
        [header: string]: string | string[];
    };
    ok: boolean;
    status: number;
    type: string;
    url: string;
}
export interface IBodyList{
    page: string;
    rubrics: [];
    size: string;
    total: number;
}

export interface IBodyCommon{
    createdBy: string;
    createdOn: Date;
    criterias: [];
    isDeleted: boolean;
    levelNames: []
    parentId: string;
    rubricId: string;
    scope: string;
    status: string;
    title: string;
    updatedBy: string;
    updatedOn: Date;
    _id: string;
}
export interface IBodyDelete{
    status: string;
}
export interface ILearningOutComeResponse {
    body: [] & ICommonBody & IBodyType & IBodyDelete;
    headers: HttpHeaders | {
        [header: string]: string | string[];
    };
    ok: boolean;
    status: number;
    type: string;
    url: string;
}
export interface ICommonBody{
    createdOn: Date;
    description: string;
    outcomeId: string;
    parentId: string;
    scope: string;
    title: string;
    __v: number;
    _id: string;
}
export interface IBodyType{
    type: string;
}

export interface CalendarEvents {
    startDate: string;
    endDate: string;
    eventName: string;
    eventDescription: string;
    eventType:string;
    allDay:boolean;
    eventId:string;
    reminder?:number
    recurrance: {
      dtstart: string;
      until?: string;
      freq: any;
      interval?: number;
      bymonthday?: number;
      byweekday?: any;
    };
  }
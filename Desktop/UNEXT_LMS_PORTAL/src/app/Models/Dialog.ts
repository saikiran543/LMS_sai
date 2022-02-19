import { NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { DialogTypes } from "../enums/Dialog";
import { Translate } from "./Translate";
export interface Dialog {
    type?:DialogTypes;
    title:Translate;
    options?: Array<Option>;
    ngbModelOptions?:NgbModalOptions;
}
export interface Option{
    operation: string;
    title: Translate;
    disable?: boolean;
}
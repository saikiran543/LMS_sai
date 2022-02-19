/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { utils as XlsxUtils, writeFile} from 'xlsx/xlsx.esm.mjs';
import { WorkBook, WorkSheet} from 'xlsx/types/index';

const EXCEL_EXTENSION = '.xlsx';

export interface ExcelJson {
  data: Array<any>;
  headers?: Array<string>;
  skipHeader?: boolean;
  origin?: string | number;
}

@Injectable()
export class XlsxService {

  /**
   *
   *
   * @private
   * @type {(WorkBook | null)}
   * @memberof XlsxService
   */
  private documentDefinition: WorkBook | null = null;

  /**
   *
   *
   * @memberof XlsxService
   */
  public create(): void {
    if (this.documentDefinition) {
      this.destroy();
    }
    this.documentDefinition = XlsxUtils.book_new();
  }
  
  /**
     *
     * destorys the document definition
     * @memberof XlsxService
     */
  destroy(): void {
    this.documentDefinition = null;
  }

  /**
   * Creates XLSX option from the data.
   *
   * @param json Json data to create xlsx.
   * @param origin XLSX option origin.
   * @returns options XLSX options.
   */
  private getOptions(json: ExcelJson, origin?: number): any {
    // adding actual data
    const options = {
      skipHeader: true,
      origin: -1,
      headers: [] as string[]
    };
    options.skipHeader = !!json.skipHeader;
    if (!options.skipHeader && json.headers?.length) {
      options.headers = json.headers;
    }
    if (origin) {
      options.origin = origin ? origin : -1;
    }
    return options;
  }
  
  /**
     *
     *
     * @private
     * @return {*}  {TDocumentDefinitions}
     * @memberof PdfmakeService
     */
  private getDefinition(): WorkBook {
    if (!this.documentDefinition) {
      throw new Error('The document isn\'t created! Please use the create()" method to create it before use it.');
    }
    return this.documentDefinition;
  }

  /**
   * Creates XLSX option from the Json data. Use this to customise the sheet by adding arbitrary rows and columns.
   *
   * @param json Json data to create xlsx.
   * @param sheetName sheetName to save as.
   */
  public createSheetFromJson(json: ExcelJson[], sheetName?: string): void {
    // inserting first blank row
    const worksheet: WorkSheet = XlsxUtils.json_to_sheet(
      json[0].data,
      this.getOptions(json[0])
    );

    for (let i = 1, length = json.length; i < length; i++) {
      const isAoA = Array.isArray(json[i].data[0]); // check if its an array of arrays.
      // adding a dummy row for separation
      XlsxUtils.sheet_add_json(
        worksheet,
        [{}],
        this.getOptions({
          data: [],
          skipHeader: true
        }, -1)
      );

      if(isAoA) {
        XlsxUtils.sheet_add_aoa(
          worksheet,
          json[i].data,
          this.getOptions(json[i], -1)
        );
      } else {
        XlsxUtils.sheet_add_json(
          worksheet,
          json[i].data,
          this.getOptions(json[i], -1)
        );
      }
    }
    const workbook = this.getDefinition();
    if(sheetName) {
      XlsxUtils.book_append_sheet(workbook, worksheet, sheetName);
      return;
    }
    XlsxUtils.book_append_sheet(workbook, worksheet);
  }

  /**
   *
   *
   * @param {string} fileName
   * @memberof XlsxService
   */
  public download(fileName: string): void {
    const workbook: WorkBook = this.getDefinition();
    writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }
}
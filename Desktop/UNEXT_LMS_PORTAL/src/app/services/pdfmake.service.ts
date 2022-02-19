import { Injectable } from "@angular/core";
import pdfmake from 'pdfmake/build/pdfmake.min';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { BufferOptions, Content, ContentOrderedList, OrderedListElement, PageBreak, StyleDictionary, Table, TDocumentDefinitions, TFontDictionary, UnorderedListElement } from "pdfmake/interfaces";

const PDF_EXTENSION = '.pdf';

const defaultDocumentDefinition: TDocumentDefinitions = {
  content: [],
  pageSize: 'LETTER',
  pageOrientation: 'portrait',
  defaultStyle: {
    font: "Roboto",
  }
};

/**
 *
 *
 * @export
 * @class PdfmakeService
 */
@Injectable()
export class PdfmakeService {

  documentDefinition: TDocumentDefinitions | null = {...defaultDocumentDefinition};

  /**
   *
   *
   * @private
   * @type {typeof pdfmake}
   * @memberof PdfmakeService
   */
  private pdfMake: typeof pdfmake;

  /**
   *
   *
   * @private
   * @type {TFontDictionary}
   * @memberof PdfmakeService
   */
  private fonts: TFontDictionary;

  /**
   * Creates an instance of PdfmakeService.
   * @memberof PdfmakeService
   */
  constructor() {
    this.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      },
    };
    pdfmake.fonts = this.fonts;
    this.pdfMake = pdfmake;
    this.pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  /**
   *
   *
   * @private
   * @return {*}  {TDocumentDefinitions}
   * @memberof PdfmakeService
   */
  private getPdfDefinition(): TDocumentDefinitions {
    if (!this.documentDefinition) {
      throw new Error('The document isn\'t created! Please use the create()" method to create it before use it.');
    }
    return this.documentDefinition;
  }

  /**
   *
   *
   * @memberof PdfmakeService
   */
  create(): void {
    if (this.documentDefinition) {
      this.destroy();
    }
    this.documentDefinition = {...defaultDocumentDefinition};
  }

  /**
   *
   *
   * @memberof PdfmakeService
   */
  destroy(): void {
    this.documentDefinition = null;
  }

  /**
   *
   *
   * @param {(BufferOptions | undefined)} [options]
   * @param {(Window | null | undefined)} [win]
   * @memberof PdfmakeService
   */
  open(options?: BufferOptions | undefined, win?: Window | null | undefined): void {
    this.pdfMake.createPdf(this.getPdfDefinition()).open(options, win);
  }

  /**
   *
   *
   * @param {(BufferOptions | undefined)} [options]
   * @param {(Window | null | undefined)} [win]
   * @memberof PdfmakeService
   */
  print(options?: BufferOptions | undefined, win?: Window | null | undefined): void {
    this.pdfMake.createPdf(this.getPdfDefinition()).print(options, win);
  }

  /**
   *
   *
   * @param {string} [defaultFileName='download']
   * @param {() => void} [cb]
   * @param {BufferOptions} [options]
   * @memberof PdfmakeService
   */
  download(defaultFileName = 'download', cb?: () => void, options?: BufferOptions): void {
    const fileName = `${defaultFileName}${PDF_EXTENSION}`;
    this.pdfMake.createPdf(this.getPdfDefinition(), {}, this.fonts, pdfFonts.pdfMake.vfs).download(fileName, cb, options);
  }

  /**
   *
   *
   * @param {StyleDictionary} styles
   * @memberof PdfmakeService
   */
  configureStyles(styles: StyleDictionary): void {
    this.getPdfDefinition().styles = styles;
  }

  /**
   *
   *
   * @param {PageBreak} [pageBreak='after']
   * @memberof PdfmakeService
   */
  addPageBreak(pageBreak: PageBreak = 'after'): void {
    (this.getPdfDefinition().content as Content[]).push({
      text: '',
      pageBreak,
    } as Content);
  }

  /**
   *
   *
   * @param {string} text
   * @param {(StyleDictionary | string)} [style]
   * @param {PageBreak} [pageBreak]
   * @memberof PdfmakeService
   */
  addText(text: string, style?: StyleDictionary | string, pageBreak?: PageBreak): void {
    (this.getPdfDefinition().content as Content[]).push({
      text,
      style,
      pageBreak,
    });
  }

  /**
   *
   *
   * @param {string[]} columnsText
   * @memberof PdfmakeService
   */
  addColumns(columnsText: string[]): void {
    const columns = [];
    for (const column of columnsText) {
      columns.push({ text: column });
    }

    (this.getPdfDefinition().content as Content[]).push({ columns });
  }

  /**
   *
   *
   * @param {PdfTable} table
   * @memberof PdfmakeService
   */
  addTable(table: Table): void {
    const content: Content = {
      table
    };

    (this.getPdfDefinition().content as Content[]).push(content);
  }

  /**
   *
   *
   * @param {string} url
   * @param {number} [width]
   * @param {number} [height]
   * @memberof PdfmakeService
   */
  addImage(url: string, width?: number, height?: number): void {
    const image = new Image();

    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;

    image.onload = () => {
      let canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      canvas.getContext('2d')?.drawImage(image, 0, 0);

      if (width && !height) {
        height = width;
      }

      const finalImage = {
        image: canvas.toDataURL('image/png'),
        width: width ? width : image.naturalWidth,
        height: height ? height : image.naturalHeight
      };

      (this.getPdfDefinition().content as Content[]).push(finalImage);

      canvas = new HTMLCanvasElement();
    };
  }

  /**
   *
   *
   * @param {UnorderedListElement[]} items
   * @memberof PdfmakeService
   */
  addUnorderedlist(items: UnorderedListElement[]): void {
    (this.getPdfDefinition().content as Content[]).push({ ul: items });
  }

  /**
   *
   *
   * @param {OrderedListElement[]} items
   * @param {boolean} [reversed=false]
   * @param {number} [start]
   * @memberof PdfmakeService
   */
  addOrderedList(items: OrderedListElement[], reversed = false, start?: number): void {
    const contentItem: ContentOrderedList = {} as ContentOrderedList;
    if(items.length) {
      contentItem.ol = items;
    }
    contentItem.reversed = reversed;
    if(start) {
      contentItem.start = start;
    }
    (this.getPdfDefinition().content as Content[]).push(contentItem);
  }
}
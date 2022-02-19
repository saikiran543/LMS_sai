/* eslint-disable max-lines-per-function */
import { TestBed } from '@angular/core/testing';
import { Content, OrderedListElement, Table, TDocumentDefinitions, UnorderedListElement } from 'pdfmake/interfaces';
import { PdfmakeService } from './pdfmake.service';

const defaultDocumentDefinition: TDocumentDefinitions = {
  content: [],
  pageSize: 'LETTER',
  pageOrientation: 'portrait',
  defaultStyle: {
    font: "Roboto",
  }
};

describe('PdfmakeService', () => {
  let service: PdfmakeService;

  const resetDocumentDefination = () => {
    service.documentDefinition = JSON.parse(JSON.stringify({ ...defaultDocumentDefinition }));
  };
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PdfmakeService]
    });
    service = TestBed.inject(PdfmakeService);
    resetDocumentDefination();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get document defination if it exists', () => {
    if(service.documentDefinition) { // default documentDefinition
      const definition = service['getPdfDefinition']();
      expect(definition).toEqual(service.documentDefinition);
    }
    service.documentDefinition = null;
    expect(service['getPdfDefinition'].bind(service)).toThrowError('The document isn\'t created! Please use the create()" method to create it before use it.');
    service.destroy();
  });

  it('should create a document definition destroy if it exist', () => {
    expect(service.documentDefinition).toEqual(defaultDocumentDefinition);
    service.documentDefinition = null as TDocumentDefinitions | null;
    service.create();
    expect(service.documentDefinition).toEqual(defaultDocumentDefinition);
    service.destroy();
  });

  it('should destroy the document definition', () => {
    expect(service.documentDefinition).toEqual(defaultDocumentDefinition);
    service.destroy();
    expect(service.documentDefinition).toEqual(null);
  });

  it('should configure styles', () => {
    service.configureStyles({});
    expect(service.documentDefinition?.styles).toEqual({});
    service.destroy();
  });

  it('should add page break', () => {
    if(service.documentDefinition) {
      service.documentDefinition.content = [] as Content[];
      service.addPageBreak();
      expect(service.documentDefinition.content).toEqual([{
        text: '',
        pageBreak: 'after',
      }]);
      service.documentDefinition.content = [] as Content[];
      service.addPageBreak('after');
      expect(service.documentDefinition?.content).toEqual([{
        text: '',
        pageBreak: 'after',
      }]);
      service.documentDefinition.content = [] as Content[];
      service.addPageBreak('before');
      expect(service.documentDefinition?.content).toEqual([{
        text: '',
        pageBreak: 'before',
      }]);
      service.destroy();
    }
  });

  it('should add text to content', () => {
    service.addText('dummy content', {}, 'before');
    expect(service.documentDefinition?.content).toEqual([{
      text: 'dummy content',
      style: {},
      pageBreak: 'before'
    }]);
    service.destroy();
  });

  it('should add columns to content', () => {
    service.addColumns(['column1', 'column2']);
    expect(service.documentDefinition?.content).toEqual([{
      columns: [{
        text: 'column1'
      }, {
        text: 'column2'
      }]
    }]);
  });

  it('should add a table to content', () => {
    const table: Table = {
      body: [
        ['first']
      ],
      headerRows: 0
    };

    service.addTable(table);
    expect(service.documentDefinition?.content).toEqual([{
      table
    }]);
  });

  it('should add an unordered list to content', () => {
    const unorderedList: UnorderedListElement[] = [{
      text: '1',
      listType: 'circle',
    }, {
      text: '2',
      listType: 'circle',
    }];

    service.addUnorderedlist(unorderedList);

    expect(service.documentDefinition?.content).toEqual([{
      ul: unorderedList
    }]);
  });

  it('should add an ordered list to content ', () => {
    const orderedList: OrderedListElement[] = [{
      text: '1',
    }, {
      text: '2',
    }];

    service.addOrderedList(orderedList);

    expect(service.documentDefinition?.content).toEqual([{
      ol: orderedList,
      reversed: false,
    }]);
  });
});

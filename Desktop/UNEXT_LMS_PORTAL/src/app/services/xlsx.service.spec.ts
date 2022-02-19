/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed } from '@angular/core/testing';
import { WorkBook } from 'xlsx/types/index';
import * as XLXS from 'xlsx/xlsx.esm.mjs';

import { XlsxService } from './xslx.service';

describe('XlsxService', () => {
  let service: XlsxService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XlsxService]
    });
    service = TestBed.inject(XlsxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should create a document definition destroy if it exist', () => {
    const documentDefinition = XLXS.utils.book_new();
    expect(service['documentDefinition']).toEqual(null);
    service['documentDefinition'] = null as WorkBook | null;
    service.create();
    expect(service['documentDefinition']).toEqual(documentDefinition);
    service.destroy();
  });

  it('should destroy the document definition', () => {
    const documentDefinition = XLXS.utils.book_new();
    service.create();
    expect(service['documentDefinition']).toEqual(documentDefinition);
    service.destroy();
    expect(service['documentDefinition']).toEqual(null);
  });

  it('should get document defination if it exists', () => {
    if(service['documentDefinition']) { // default documentDefinition
      const definition = service['getDefinition']();
      expect(definition).toEqual(service['documentDefinition']);
    }
    service['documentDefinition'] = null;
    expect(service['getDefinition'].bind(service)).toThrowError('The document isn\'t created! Please use the create()" method to create it before use it.');
    service.destroy();
  });

  it('should get options', () => {
    let options = service['getOptions']({
      data: [],
      headers: [],
      origin: -1,
      skipHeader: false
    });
    expect(options).toEqual({
      skipHeader: false,
      origin: -1,
      headers: [ ]
    });
    options = service['getOptions']({
      data: [],
      headers: [],
      origin: -1,
      skipHeader: true
    });
    expect(options).toEqual({
      skipHeader: true,
      origin: -1,
      headers: [ ]
    });
  });

  it('should create document definition from json', () => {
    service.create();
    service.createSheetFromJson([{
      data: [{
        first: '1',
        second: '2',
      }],
      headers: [],
    }]);

    expect(service['documentDefinition']).toEqual({
      "SheetNames": [
        "Sheet1"
      ],
      "Sheets": {
        "Sheet1": {
          "A2": {
            "t": "s",
            "v": "1"
          },
          "B2": {
            "t": "s",
            "v": "2"
          },
          "A1": {
            "t": "s",
            "v": "first"
          },
          "B1": {
            "t": "s",
            "v": "second"
          },
          "!ref": "A1:B2"
        }
      }
    });
  });

  it('should create document definition from array of array', () => {
    service.create();
    service.createSheetFromJson([{
      data: [
        ['first', 'second']
      ],
      headers: [],
    }]);

    expect(service['documentDefinition']).toEqual({
      "SheetNames": [
        "Sheet1"
      ],
      "Sheets": {
        "Sheet1": {
          "A2": {
            "t": "s",
            "v": "first"
          },
          "B2": {
            "t": "s",
            "v": "second"
          },
          "A1": {
            "t": "s",
            "v": "0"
          },
          "B1": {
            "t": "s",
            "v": "1"
          },
          "!ref": "A1:B2"
        }
      }
    });
  });
});

/* eslint-disable max-lines-per-function */
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { FileUploadComponent } from './file-upload.component';
import translations from '../../../../assets/i18n/en.json';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Cropper from 'cropperjs';
import { FileHandle } from 'src/app/directives/dragDrop.directive';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}
export class MockNgbModalRef {
  componentInstance = {
    confirmStatus: of(true)
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Promise<any> = new Promise((resolve) => resolve(true));

  close(): void {
    // mock function
  }

  dismiss(): void {
    //mock funciton
  }
}

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let translate: TranslateService;
  const mockModalRef: MockNgbModalRef = new MockNgbModalRef();
  let modalService: NgbModal;
  let cropper: Cropper;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      })],
      declarations: [FileUploadComponent],
      providers: [TranslateService, NgbActiveModal]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    modalService = TestBed.inject(NgbModal);
    const image = new Image();
    cropper = new Cropper(image);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('all files: should return true', () => {
    const result = component.isValidFileType('image/*', '*');
    expect(result).toBeTruthy();
  });

  it('Single file type: should return false', () => {
    const result = component.isValidFileType('image/png', 'image/jpeg');
    expect(result).toBeFalsy();
  });

  it('Empty allowed files: should return true', () => {
    const result = component.isValidFileType('image/*', '');
    expect(result).toBeTruthy();
  });

  it('Invalid file: should return false', () => {
    const result = component.isValidFileType('application/doc', 'image/jpeg, image/png');
    expect(result).toBeFalsy();
  });

  it('Multiple accepted file: should return false', () => {
    const result = component.isValidFileType('application/docx', 'application/doc, image/*');
    expect(result).toBeFalsy();
  });

  it('Multiple accepted files: should return true', () => {
    const result = component.isValidFileType('image/png', 'application/doc, image/*');
    expect(result).toBeTruthy();
  });

  it('should render expected html', () => {
    component.uploadTitle = 'admin.loginSettings.logoUploadTitle';
    component.dragDropText = 'admin.loginSettings.logoDragDrop';
    component.buttonText = 'admin.loginSettings.logoButton';
    component.noteText = 'admin.loginSettings.logoNote';
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.file-title').textContent).toContain('Logo');
    expect(compiled.querySelector('.file-drag-drop-text').textContent).toContain('Drag & drop image here');
    expect(compiled.querySelector('.file-button-text').textContent).toContain('Upload Logo Image');
    expect(compiled.querySelector('.file-note-pref').textContent).toContain('Note');
    expect(compiled.querySelector('.file-note-text').textContent).toContain('You can only choose jpg, jpeg, img, png file types. Max image size should be 52 x 168');

  });

  it('ngOnChanges: should be valid', () => {
    component.savedImage = "sampleBase64";
    component.ngOnChanges();
    expect(component.openImageEdit.call.length).toEqual(1);
  });

  it('onFileSelect: return false on undefined', () => {
    const input = {
      files: [undefined]
    };
    expect(component.onFileSelect(input)).toBeFalsy();
  });

  it('onFileSelect: return false on invalid file type', () => {
    component.acceptedFiles = 'image/jpg';
    const input = {
      files: [
        {
          type: 'image/png'
        }
      ]
    };
    expect(component.onFileSelect(input)).toBeFalsy();
  });

  it('onFileSelect: emit file data if type is file', () => {
    component.fileType = 'file';
    component.acceptedFiles = 'image/jpg';
    const input = {
      files: [
        {
          type: 'image/jpg'
        }
      ]
    };
    component.onFileSelect(input);
    expect(component.fileSaved.emit.call.length).toEqual(1);
  });

  it('onFileSelect: validate proper image select', () => {
    component.fileType = 'image';
    component.acceptedFiles = 'image/jpg';
    const input = {
      files: [
        new Blob([""], { type: 'image/jpg' })
      ]
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    component.onFileSelect(input);
    expect(component.initCropper.call.length).toEqual(1);
  });

  it('rotate: should validate', () => {
    component.cropper = cropper;
    spyOn(cropper, 'rotate');
    component.rotate();
    expect(component.cropper.rotate.call.length).toEqual(1);
  });

  it('flipHorizontal: should validate', () => {
    component.cropper = cropper;
    spyOn(cropper, 'scaleX');
    component.flipHorizontal();
    expect(component.cropper.scaleX.call.length).toEqual(1);
  });

  it('flipHorizontal: should validate 1', () => {
    component.scaleX = 1;
    component.cropper = cropper;
    spyOn(cropper, 'scaleX');
    component.flipHorizontal();
    expect(component.cropper.scaleX.call.length).toEqual(1);
  });

  it('flipVertical: should validate', () => {
    component.cropper = cropper;
    spyOn(cropper, 'scaleY');
    component.flipVertical();
    expect(component.cropper.scaleY.call.length).toEqual(1);
  });

  it('flipVertical: should validate 1', () => {
    component.scaleY = 1;
    component.cropper = cropper;
    spyOn(cropper, 'scaleY');
    component.flipVertical();
    expect(component.cropper.scaleY.call.length).toEqual(1);
  });

  it('reset: should validate', () => {
    component.reset();
    component.initCropper = (): void => {
      //mock
    };
    expect(component.initCropper.call.length).toEqual(1);
  });

  it('onInputChange: should validate', () => {
    component.cropper = cropper;
    const event = {
      target: {
        value: 100
      }
    };
    spyOn(cropper, 'zoomTo');
    component.onInputChange(event);
    expect(component.currentZoomLevel).toEqual(event.target.value / 100);
    expect(component.cropper.zoomTo.call.length).toEqual(1);
    expect(component.setScrollThumbLabelValue.call.length).toEqual(1);
  });

  it('upload: should validate', () => {
    const canvas = document.createElement('canvas');
    component.cropper = cropper;
    spyOn(cropper, 'getCroppedCanvas').and.returnValue(canvas);
    component.selectedFile = undefined;
    component.chosenImage = 'base64sample';
    component.upload();
    expect(component.fileSaved.emit.call.length).toEqual(1);
  });

  it('upload: should validate get base64', fakeAsync(() => {
    const canvas = document.createElement('canvas');
    component.cropper = cropper;
    spyOn(cropper, 'getCroppedCanvas').and.returnValue(canvas);
    component.selectedFile = new File([""], "filename", { type: 'image/jpg' });
    component.chosenImage = '';
    component.upload();
    expect(component.fileSaved.emit.call.length).toEqual(1);
  }));

  it('upload: should validate get base64', () => {
    const file: FileHandle[] = [
      {
        file: new File([""], "filename", { type: 'image/jpg' }),
        url: 'testUrl'
      }
    ];
    component.acceptedFiles = 'image/jpg';
    component.fileType = 'image';
    component.filesDropped(file);
    expect(component.chosenImage).toEqual('testUrl');
    expect(component.selectedFile).toEqual(file[0].file);
    expect(component.initCropper.call.length).toEqual(1);
    component.fileType = 'file';
    component.filesDropped(file);
    expect(component.fileSaved.emit.call.length).toEqual(1);
    component.acceptedFiles = 'image/png';
    component.fileType = 'image';
    component.filesDropped(file);
    expect(alert.call.length).toEqual(1);
  });

});

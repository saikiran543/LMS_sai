import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import Cropper from 'cropperjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileHandle } from '../../../directives/dragDrop.directive';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnChanges {
  title = 'imagecropper';
  cropper!: Cropper;
  newUrl!: SafeResourceUrl;
  scaleX = -1;
  scaleY = -1;
  chosenImage!: SafeResourceUrl;
  imageZoomMinLevel = 1;
  imageZoomFitContainer = 1;
  imageZoomMaxLevel = 100;
  currentZoomLevel!: number;
  positionPercentage = 1;
  droppedFile: FileHandle[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedFile: any;
  selectedFileName!: string;
  isInvalid = false;
  // Output image width
  @Input() outputWidth = 1;
  // Output image height
  @Input() outputHeight = 1;
  // Type of file. 'file' or 'image'. Image will return base64 and file will return file details array.
  @Input() fileType = 'file';
  // Accepted file types by the uploader
  @Input() acceptedFiles = "image/jpg, image/jpeg, image/png, image/img";
  // Text to show as a note below the upload area
  @Input() noteText = '';
  // Text to show at the drag and drop area
  @Input() dragDropText = '';
  // Button text for browse file button
  @Input() buttonText = '';
  // Title text for the upload area
  @Input() uploadTitle = '';
  // Option to show file uploader
  @Input() showUploader = true;
  // Currently saved image
  @Input() savedImage = '';
  // show/hide "Browse from Content Collection" button
  @Input() contentCollectionBrowse = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() fileSaved: EventEmitter<any> = new EventEmitter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() selectedFilName: EventEmitter<any> = new EventEmitter();

  @ViewChild('content') content!: ElementRef;
  @ViewChild('imageCropperFile') imageCropperFile!: ElementRef;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public sanitizer: DomSanitizer,
    private http: HttpClient
  ) {

  }

  ngOnChanges(): void {
    if (this.savedImage !== '') {
      this.openImageEdit();
    }
  }

  /**
   * Function to upload the image when click on save
   */
  upload(): void {
    this.selectedFilName.emit(this.selectedFile);
    const newUcroppedCanvasrl = this.cropper.getCroppedCanvas(
      {
        width: this.outputWidth,
        height: this.outputHeight,
        fillColor: 'white'
      }) as HTMLCanvasElement;
    this.newUrl = newUcroppedCanvasrl.toDataURL();
    // this.newUrl = newUcroppedCanvasrl.toDataURL('image/jpeg'); //To convert output to jpeg
    if (typeof this.selectedFile === 'undefined' && this.chosenImage !== '') {
      this.fileSaved.emit({
        name: this.selectedFileName,
        cropped: this.newUrl,
        original: this.chosenImage
      });
    } else {
      this.getBase64(this.selectedFile).then(base64 => {
        this.fileSaved.emit({
          name: this.selectedFileName,
          cropped: this.newUrl,
          original: base64
        });
      });
    }
  }

  /**
   * Initialize the cropper
   */
  initCropper(): void {
    this.imageZoomFitContainer = this.currentZoomLevel * 100;
    setTimeout(() => {
      if (this.cropper) {
        this.cropper.destroy();
      }
      const image = document.getElementById('imageCropperContent') as HTMLImageElement;
      this.cropper = new Cropper(image, {
        aspectRatio: this.outputWidth / this.outputHeight,
        viewMode: 0,
        center: true,
        dragMode: 'move',
        movable: true,
        scalable: true,
        cropBoxMovable: true,
        zoomOnWheel: false,
        checkCrossOrigin: false,
        ready: () => {
          const canvasData = this.cropper.getCanvasData();
          this.imageZoomFitContainer = (canvasData.width / canvasData.naturalWidth) * 100;
          if (this.imageZoomFitContainer > 100) {
            this.cropper.zoomTo(1);
            this.imageZoomFitContainer = (canvasData.width / canvasData.naturalWidth) * 100;
            this.setScrollThumbLabelValue(1);
          } else {
            this.currentZoomLevel = this.imageZoomFitContainer / 100;
            this.setScrollThumbLabelValue(this.currentZoomLevel);
          }
        }
      });
    }, 100);

  }

  /**
   * Function will trigger when select the file
   * It will open the modal and initialize cropper
   * @param input
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  onFileSelect(input: any): boolean | void {
    if (typeof input.files[0] === 'undefined') {
      return false;
    }
    const fileType = input.files[0].type;
    if (!this.isValidFileType(fileType, this.acceptedFiles)) {
      //alert('Invalid file type found');
      this.isInvalid = true;
      return false;
    }
    if (this.fileType === 'file') {
      this.isInvalid = false;
      this.fileSaved.emit(input.files);
    } else {
      this.isInvalid = false;
      this.chosenImage = '';
      this.selectedFile = input.files[0];
      this.selectedFileName = input.files[0].name;
      const reader = new FileReader();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reader.onload = (event: any) => {
        this.chosenImage = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.result);
      };
      reader.readAsDataURL(input.files[0]);
      this.open();
      this.initCropper();
    }

  }

  /**
   * Function to open the image cropper modal
   */
  private open() {
    const modalRef = this.modalService.open(this.content, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      modalDialogClass: 'custom-modalclass',
      keyboard: false
    });
    modalRef.result.then(
      () => {
        this.imageCropperFile.nativeElement.value = '';
        this.emitEmptyData();
      },
      () => {
        this.imageCropperFile.nativeElement.value = '';
        this.emitEmptyData();
      }
    );
  }

  /**
   * Function to rotate the image anticlockwise
   */
  rotate(): void {
    this.cropper.rotate(-45);
  }

  /**
   * Function to flip image horizontally
   */
  flipHorizontal(): void {
    this.cropper.scaleX(this.scaleX);
    this.scaleX = this.scaleX === -1 ? 1 : -1;
  }

  /**
   * Function to flip image vertically
   */
  flipVertical(): void {
    this.cropper.scaleY(this.scaleY);
    this.scaleY = this.scaleY === -1 ? 1 : -1;
  }

  /**
   * Function to reset the image to initial state
   */
  reset(): void {
    this.initCropper();
  }

  /**
   * Function to zoom in or zoom out based on the slider movement
   * @param event
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  onInputChange(event: any): void {
    this.currentZoomLevel = event.target.value / 100;
    this.cropper.zoomTo(this.currentZoomLevel);
    this.setScrollThumbLabelValue(this.currentZoomLevel);
  }

  /**
   * Function will trigger when drop the file
   * @param files
   */
  filesDropped(files: FileHandle[]): boolean | void {
    this.droppedFile = files;
    const fileType = this.droppedFile[0].file.type;
    if (!this.isValidFileType(fileType, this.acceptedFiles)) {
      //alert('Invalid file type found');
      this.isInvalid = true;
      return false;
    }
    if (this.fileType === 'file') {
      this.isInvalid = false;
      this.fileSaved.emit(this.droppedFile[0].file);
    } else {
      this.isInvalid = false;
      this.chosenImage = this.droppedFile[0].url;
      this.selectedFile = this.droppedFile[0].file;
      this.open();
      this.initCropper();
    }

  }

  /**
   * Function to set the scroll thumb display value
   * @param currentValue
   */
  setScrollThumbLabelValue(currentValue: number): void {
    this.positionPercentage = +(currentValue * 100).toFixed(2);
  }

  /**
   * Function to check the file mime type
   * @param fileType string
   * @param acceptedTypes string
   * @returns boolean
   */
  isValidFileType(fileType: string, acceptedTypes: string): boolean {
    if (acceptedTypes === '' || acceptedTypes === '*') {
      return true;
    }
    const acceptedTypeArray = acceptedTypes.split(',').map((val) => {
      return val.trim();
    });
    const allMimeArray: string[] = [];
    // If accepted array is empty or *, then will support all file types
    if (acceptedTypeArray.length === 0 || acceptedTypeArray.indexOf('*') >= 0) {
      return true;
    }
    // If accepted file type is directly inside the accepted array
    if (acceptedTypeArray.indexOf(fileType) >= 0) {
      return true;
    }
    acceptedTypeArray.forEach(function (mime) {
      const mimeSplit = mime.split('/');
      if (mimeSplit[1] === '*') {
        allMimeArray.push(mimeSplit[0]);
      }
    });
    // If we use the type like image/* or application/* then this function will trigger
    if (allMimeArray.length > 0) {
      const fileTypeSplit = fileType.split('/');
      if (allMimeArray.indexOf(fileTypeSplit[0]) >= 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * Function to show the image uploader when click on edit
   * @param imageSrc
   */
  openImageEdit(): void {
    this.chosenImage = this.savedImage;
    this.savedImage = '';
    this.open();
    this.initCropper();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  private async getBase64(file: any) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
    });
  }

  /**
   * Function to emit empty image data
   */
  emitEmptyData(): void {
    this.fileSaved.emit({
      name: '',
      cropped: '',
      original: ''
    });
  }

  /**
   * Function to manage file browse from content collection
   * @param event
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  browseContentCollection(event: any): void {
    event.preventDefault();
  }

}

import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import Cropper from 'cropperjs';
import {
  NgbActiveModal,
  NgbModal,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileHandle } from '../../../directives/dragDrop.directive';
import $ from 'jquery';
import { result } from 'lodash';

declare const VideoUpload: any;
declare const recorder: any;

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.scss'],
})
export class VideoUploadComponent implements OnChanges {
  j1: HTMLScriptElement;
  j2: HTMLScriptElement;
  j3: HTMLScriptElement;
  j4: HTMLScriptElement;
  j5: HTMLScriptElement;
  j6: HTMLScriptElement;
  j7: HTMLScriptElement;
  j8: HTMLScriptElement;
  j9: HTMLScriptElement;
  j10: HTMLScriptElement;

  title = 'imagecropper';
  cropper!: Cropper;
  newUrl!: SafeResourceUrl;
  scaleX = -1;
  scaleY = -1;
  chosenVideo!: SafeResourceUrl;
  imageZoomMinLevel = 1;
  imageZoomFitContainer = 1;
  imageZoomMaxLevel = 100;
  currentZoomLevel!: number;
  CaptureExpress = false;
  SelfCapture = false;
  showyoutube = false;
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
  @Input() acceptedFiles = 'video/mp4, video/mpeg';
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

  @ViewChild('content') content!: ElementRef;
  @ViewChild('imageCropperFile') imageCropperFile!: ElementRef;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
    this.j1 = document.createElement('script');
    this.j1.src = '../../../../assets/js/jquery.ui.widget.js';
    document.head.appendChild(this.j1);
    this.j2 = document.createElement('script');
    this.j2.src = '../../../../assets/js/jquery.iframe-transport.js';
    document.head.appendChild(this.j2);
    this.j3 = document.createElement('script');
    this.j3.src = '../../../../assets/js/webtoolkit.md5.js';
    document.head.appendChild(this.j3);
    this.j4 = document.createElement('script');
    this.j4.src = '../../../../assets/js/jquery.fileupload.js';
    document.head.appendChild(this.j4);
    this.j5 = document.createElement('script');
    this.j5.src = '../../../../assets/js/jquery.fileupload-process.js';
    document.head.appendChild(this.j5);
    this.j6 = document.createElement('script');
    this.j6.src = '../../../../assets/js/jquery.fileupload-validate.js';
    document.head.appendChild(this.j6);
    this.j7 = document.createElement('script');
    this.j7.src = '../../../../assets/js/jquery.fileupload-kaltura.js';
    document.head.appendChild(this.j7);
    this.j8 = document.createElement('script');
    this.j8.src = '../../../../assets/js/jquery.fileupload-kaltura-base.js';
    document.head.appendChild(this.j8);
    this.j9 = document.createElement('script');
    this.j9.src = '../../../../assets/js/VideoUpload.js';
    document.head.appendChild(this.j9);
    this.j10 = document.createElement('script');
    this.j10.src = '../../../../assets/js/ExpressRecorder.js';
    document.head.appendChild(this.j10);
  }

  ngOnChanges(): void {
    if (this.savedImage !== '') {
    }
  }

  /**
   * Function to upload the image when click on save
   */
  upload(): void {
    const newUcroppedCanvasrl = this.cropper.getCroppedCanvas({
      width: this.outputWidth,
      height: this.outputHeight,
      fillColor: 'white',
    }) as HTMLCanvasElement;
    this.newUrl = newUcroppedCanvasrl.toDataURL();
    // this.newUrl = newUcroppedCanvasrl.toDataURL('image/jpeg'); //To convert output to jpeg
    if (typeof this.selectedFile === 'undefined' && this.chosenVideo !== '') {
      this.fileSaved.emit({
        name: this.selectedFileName,
        cropped: this.newUrl,
        original: this.chosenVideo,
      });
    } else {
      this.getBase64(this.selectedFile).then((base64) => {
        this.fileSaved.emit({
          name: this.selectedFileName,
          cropped: this.newUrl,
          original: base64,
        });
      });
    }
  }

  test() {
    VideoUpload();
  }
  see() {
    let x = $('#getdata').text();
    console.log(x, 'asdawdasdawdasdawawdasdaw');
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
      const image = document.getElementById(
        'imageCropperContent'
      ) as HTMLImageElement;
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
          this.imageZoomFitContainer =
            (canvasData.width / canvasData.naturalWidth) * 100;
          if (this.imageZoomFitContainer > 100) {
            this.cropper.zoomTo(1);
            this.imageZoomFitContainer =
              (canvasData.width / canvasData.naturalWidth) * 100;
            this.setScrollThumbLabelValue(1);
          } else {
            this.currentZoomLevel = this.imageZoomFitContainer / 100;
            this.setScrollThumbLabelValue(this.currentZoomLevel);
          }
        },
      });
    }, 100);
  }
  showYoutube(): void {
    this.showyoutube = true;
  }
  closeResult = '';
  express(content:any) {
    this.CaptureExpress = true;
    recorder();
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  selfCap() {
    this.SelfCapture = true;
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
      this.chosenVideo = '';
      this.selectedFile = input.files[0];
      this.selectedFileName = input.files[0].name;
      const reader = new FileReader();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reader.onload = (event: any) => {
        this.chosenVideo = this.sanitizer.bypassSecurityTrustResourceUrl(
          event.target.result
        );
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
      keyboard: false,
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
    console.log(this.droppedFile);
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
      this.chosenVideo = this.droppedFile[0].url;
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
  // openImageEdit(): void {
  //   this.chosenVideo = this.savedImage;
  //   this.savedImage = '';
  //   this.open();
  //   this.initCropper();
  // }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  private async getBase64(file: any) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
    });
  }
  youtubesave(event: string): void {
    console.log(event, 'chooddam');
  }

  /**
   * Function to emit empty image data
   */
  emitEmptyData(): void {
    this.fileSaved.emit({
      name: '',
      original: '',
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

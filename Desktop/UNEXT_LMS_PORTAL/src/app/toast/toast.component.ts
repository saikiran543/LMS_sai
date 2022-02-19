import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer!: ToastContainerDirective;
  @Input() type = '';
  @Input() message = '';
  @Input() heading = '';
  @Input() position = 'inline';
  @Input() timeOut = 3000;
  @Output() toastClick: EventEmitter<string> = new EventEmitter();
  @Input() toastNumber = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toastRef!: any;

  constructor(private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.toastrService.overlayContainer = this.toastContainer;
    this.openToastContainer();
  }

  openToastContainer(): void {
    switch (this.type) {
      case 'error':
        this.error();
        break;
      case 'success':
        this.success();
        break;
      default:
        break;
    }
  }

  error(): void {
    this.toastRef = this.toastrService
      .error(this.message, this.heading, {
        positionClass: this.position,
        closeButton: true,
        tapToDismiss: false,
        enableHtml: true,
        timeOut: this.timeOut,
        extendedTimeOut: this.timeOut
      })
      .onHidden.pipe(take(1))
      .subscribe(() => this.toasterClickedHandler());
    this.toastRef.toastId = this.toastNumber;
  }

  toasterClickedHandler(): void {
    this.toastClick.emit(this.toastRef.toastId);
  }

  success(): void {
    this.toastRef = this.toastrService.success(this.message, this.heading, {
      positionClass: this.position,
      closeButton: true,
      tapToDismiss: false,
      enableHtml: true,
      timeOut: this.timeOut,
      extendedTimeOut: this.timeOut,
    })
      .onHidden.pipe(take(1))
      .subscribe(() => this.toasterClickedHandler());
    this.toastRef.toastId = this.toastNumber;
  }
}

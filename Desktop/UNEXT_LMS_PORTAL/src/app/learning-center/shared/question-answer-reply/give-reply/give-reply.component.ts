import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator } from 'src/app/form-validation/CustomValidator';

@Component({
  selector: 'app-give-reply',
  templateUrl: './give-reply.component.html',
  styleUrls: ['./give-reply.component.scss']
})
export class GiveReplyComponent implements OnInit {
  @Output() reply = new EventEmitter();
  @Output() close = new EventEmitter();
  replyForm!: FormGroup;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private toastService: ToastrService) { }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {
    this.replyForm = new FormGroup({
      'reply': new FormControl('', [Validators.required, CustomValidator.blankSpace])
    });
  }

  cancel(): void {
    this.close.emit();
  }
  
  onSubmit(): void {
    if(!this.replyForm.valid){
      this.showErrorToast('Please complete all the mandatory fields');
      return;
    }
    this.reply.emit(this.replyForm.value.reply);
    this.cancel();
  }

  showErrorToast(message: string): void {
    this.toastService.error(message, '', {
      positionClass: 'toast-top-center',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
  }

}

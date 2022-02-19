import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidator } from 'src/app/form-validation/CustomValidator';

interface Params {
  answer: string;
}
@Component({
  selector: 'app-edit-answer-reply',
  templateUrl: './edit-answer-reply.component.html',
  styleUrls: ['./edit-answer-reply.component.scss']
})
export class EditAnswerReplyComponent implements OnInit {
  editForm!: FormGroup;
  params: Params = {
    answer: ''
  }
  @Output() editedAnswer = new EventEmitter<string>();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private ngbModal: NgbModal) { }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {
    this.editForm = new FormGroup({
      'reply': new FormControl(this.params.answer, [Validators.required, CustomValidator.blankSpace])
    });
  }

  cancel(): void {
    this.ngbModal.dismissAll();
  }

  onSubmit(): void {
    this.editedAnswer.emit(this.editForm.value.reply);
    this.cancel();
  }

}

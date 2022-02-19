import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { QuestionAnswerService } from 'src/app/learning-center/course-services/question-answer.service';
import { CustomValidator } from 'src/app/form-validation/CustomValidator';
import { ToastrService } from 'ngx-toastr';

interface Params {
  title: string;
  description: string;
}
@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.scss']
})
export class AskQuestionComponent implements OnInit {

  questionForm!: FormGroup;
  type = 'question';
  titleLengthText = '';
  submitted = false;

  @Output() askedQuestion = new EventEmitter<Params | boolean>();

  constructor(
    private ngbModal: NgbModal,
    private questionAnswerService: QuestionAnswerService,
    private translationService: TranslateService,
    private toastService: ToastrService
  ) { }
  ngOnInit(): void {
    this.questionForm = new FormGroup({
      'title': new FormControl('', [Validators.required, Validators.maxLength(250), CustomValidator.blankSpace]),
      'description': new FormControl('',)
    });
    this.setDefaultCharLength();
    this.showCharacterLeft();
  }

  /**
   *
   *
   * @private
   * @memberof DiscussionComponent
   */
  private setDefaultCharLength(): void {
    const maxOfCharacterTrasnlationKey = 'discussionForums.creationAndManipulation.maxOfCharacter';
    this.translationService.get(maxOfCharacterTrasnlationKey, { length: 250 }).subscribe((res: string) => {
      this.titleLengthText = res;
    }).unsubscribe();
  }

  /**
   *
   *
   * @private
   * @memberof DiscussionComponent
   */
  private showCharacterLeft(): void {
    const title = this.questionForm.get('title');
    if (title) {
      title.valueChanges.subscribe(val => {
        this.setCharacterLeftText(val);
      });
    }
  }

  /**
     *
     *
     * @private
     * @param {string} [text='']
     * @return {*}  {void}
     * @memberof DiscussionComponent
     */
  private setCharacterLeftText(text = ''): void {
    const maxLength = 250;
    if (text === '' || text === null) {
      this.setDefaultCharLength();
      return;
    }
    const textLength = text.length;
    const charLeft = maxLength - textLength;
    let translationKey = 'discussionForums.creationAndManipulation.charactersLeft';
    if (charLeft <= 1) {
      translationKey = 'discussionForums.creationAndManipulation.characterLeft';
    }
    this.translationService.get(translationKey, { length: charLeft }).subscribe((res: string) => {
      this.titleLengthText = res;
    }).unsubscribe();
  }

  cancel(): void {
    this.ngbModal.dismissAll();
  }

  async onSubmit(): Promise<void> {
    if(!this.questionForm.valid){
      this.showErrorToast('Please complete all the mandatory fields');
      return;
    }
    if (!this.submitted) {
      this.submitted = true;
      const response = await this.questionAnswerService.askQuestion(this.questionForm.value);
      if (response) {
        this.askedQuestion.emit(response);
      } else {
        this.askedQuestion.emit(false);
      }
    }
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

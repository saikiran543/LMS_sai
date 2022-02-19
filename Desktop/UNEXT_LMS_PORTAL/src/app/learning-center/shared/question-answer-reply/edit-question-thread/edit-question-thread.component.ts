import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidator } from 'src/app/form-validation/CustomValidator';

interface Params {
  title: string;
  description: string;
}
@Component({
  selector: 'app-edit-question-thread',
  templateUrl: './edit-question-thread.component.html',
  styleUrls: ['./edit-question-thread.component.scss']
})
export class EditQuestionThreadComponent implements OnInit {
  editForm!: FormGroup;
  titleLengthText = '';
  params: Params = {
    title: '',
    description: ''
  }
  @Output() editedQuestion = new EventEmitter<Params>();

  constructor(private ngbModal: NgbModal, private translationService: TranslateService,) { }

  ngOnInit(): void {
    this.editForm = new FormGroup({
      'title': new FormControl(this.params.title, [Validators.required, Validators.maxLength(250), CustomValidator.blankSpace]),
      'description': new FormControl(this.params.description)
    });
    this.setDefaultCharLength();
    this.showCharacterLeft();
    this.setCharacterLeftText(this.params.title);
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
    const title = this.editForm.get('title');
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

  onSubmit(): void {
    this.editedQuestion.emit(this.editForm.value);
    this.cancel();
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator } from 'src/app/form-validation/CustomValidator';
import { QuestionAnswerService } from 'src/app/learning-center/course-services/question-answer.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {
  descriptionPlaceholder = '';
  questionForm = new FormGroup({
    'title': new FormControl('', [Validators.required, Validators.maxLength(250), CustomValidator.blankSpace]),
    'description': new FormControl('',)
  });
  titleLengthText = '';
  submitted = false;

  constructor(
    private questionAnswerService: QuestionAnswerService,
    private toastrService: ToastrService,
    private translationService: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setDefaultCharLength();
    this.showCharacterLeft();

    this.translationService.get('qna.addQuestion.form.descriptionPlaceholder').subscribe((res: string) => {
      this.descriptionPlaceholder = res;
    }).unsubscribe();
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

  navigateBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route, queryParamsHandling: "preserve" });
  }

  async onSubmit(): Promise<void> {
    if (!this.submitted) {
      this.submitted = true;
      const response = await this.questionAnswerService.askQuestion(this.questionForm.value);
      if (response) {
        this.translationService.get('qna.addQuestion.form.successMessage').subscribe((res: string) => {
          this.toastrService.success(res, '', {
            closeButton: true
          });
          this.navigateBack();
        }).unsubscribe();
      }
    }
  }
}

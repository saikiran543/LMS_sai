import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogTypes } from 'src/app/enums/Dialog';
import { Dialog } from 'src/app/Models/Dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import { QuestionAnswerService, QuestionResponseForQnADashboard } from '../../course-services/question-answer.service';

@Component({
  selector: 'app-qna-right-panel',
  templateUrl: './qna-right-panel.component.html',
  styleUrls: ['./qna-right-panel.component.scss']
})
export class QnaRightPanelComponent implements OnInit, OnDestroy{
  questionId!:string;
  viewOnlyMode = false;
  questionIdListener!: Subscription;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  question!:QuestionResponseForQnADashboard | null;
  // eslint-disable-next-line max-params
  constructor(private routeOperationService: RouteOperationService, private questionAnswerService :QuestionAnswerService, private storageService: StorageService, private router: Router, private activatedRoute: ActivatedRoute, private dialogService: DialogService){}
  ngOnInit(): void {
    this.questionIdListener = this.routeOperationService.listen('questionId').subscribe(async (data:string)=>{
      this.questionId = data;
      //console.log('Active question',this.questionId);
      if(this.questionId) {
        await this.fetchQuestion(this.questionId);
      }
      
    });
  }
  async fetchQuestion(questionId: string) : Promise<void>{
    this.question=null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await this.questionAnswerService.getQuestion(questionId);
    this.question = response.body;
    this.viewOnlyMode = this.question?.isContentDeleted? true: false;
  }
  pinUnpinQuestion(questionId: string): void{
    this.storageService.broadcastValue('pinQuestion',questionId);
  }
  redirectToContentPlayer(): void{
    const dialogConfig: Dialog ={
      type: DialogTypes.WARNING,
      title: {
        translationKey: 'qna.question.contentDeleted'
      }
    };
    if(!this.question?.isContentDeleted){
      this.router.navigate([`../../../content-area/list/content/${this.question?.elementId}/`],{relativeTo: this.activatedRoute ,queryParamsHandling: "merge" });
    }else{
      this.dialogService.showAlertDialog(dialogConfig);
    }
  }
  likeUnlikeQuestion(likeUnlike: boolean): void{
    const payLoad = {
      likeUnlike: likeUnlike,
      questionId: this.questionId
    };
    this.storageService.broadcastValue('likeUnlikeEmitter',payLoad);
  }

  deleteQuestion(questionId: string): void {
    this.storageService.broadcastValue('deleteQuestionEmitter', questionId);
    this.question = null;
  }

  reply(isAdded: boolean): void {
    const payLoad = {
      isAdded,
      questionId: this.questionId
    };
    this.storageService.broadcastValue('replyAddedEmitter', payLoad);
  }

  ngOnDestroy(): void {
    this.questionIdListener.unsubscribe();
  }
}

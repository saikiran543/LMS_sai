/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from 'src/app/enums/service';
import { StorageKey } from 'src/app/enums/storageKey';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import { RatingService } from './service/rating-service.service';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  private unsubscribe$ = new Subject<void>();

  userType!:string;

  ratings!:any;

  comments!:any;

  last_id!:string;

  emptyRatings!:boolean;

  courseId!:string;

  contentId!:string;

  finished = false;

  level!:number;

  userComment!:any;

  someComment!:any;

  inputComment ="";

  userRating = 5;

  showCommentBox = false;

  ratingCompulsory = false;

  orginalRating={
    comment: "",
    rating: 0
  }

  rating = false;

  editRating = false;

  ratingMessage = "";

  ratingPlaceHolder="";

  ratingTitle ="";

  ratingOpactiy:boolean[] = [false,false,false,false,false];

  ratingTransform:boolean[] = [false,false,false,false,false];

  contentEditable = true;

  previousScrollValue = 0;
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  charactersRemaining(){
    if(this.inputComment.length>1){
      this.ratingCompulsory=false;
    }
    return {
      length: 250 - this.inputComment.length
    };
  }
    
  // eslint-disable-next-line max-params
  constructor(private route: ActivatedRoute,
    private router: Router,
    private routeOperation: RouteOperationService,
    private storageServise: StorageService,
    private toastService: ToastrService,
    private translate:TranslateService,
    private ratingService: RatingService) { }

  ngOnInit(): void {
    this.translate.use('en');
    this.userType = this.storageServise.get(StorageKey.USER_CURRENT_VIEW);
    this.comments = [];
    this.routeOperation.listenParams().pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      if(this.userType ==="admin"){
        this.courseId = params.courseId;
        this.contentId = params.id;
        this.readRatings(this.courseId, this.contentId);
      }
      else{
        this.courseId = params.courseId;
        this.contentId = params.id;
        this.getStudentRating(this.courseId, this.contentId);
      
      }

    });

  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onScrollDown(){
    if(!this.level || this.level<1){
      this.getMoreComments(this.courseId,this.contentId,this.last_id);
    }
    else{
      this.getMoreComments(this.courseId,this.contentId,this.last_id,this.level);
    }
  }
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  readRatings(courseId: string, contentId: string){
    this.ratingService.sendToBackend(Service.COURSE_SERVICE, `ratings/overview?courseId=${courseId}&contentId=${contentId}`, HttpMethod.GET, {}).then((response: any) => {
      this.ratings = response.body;
      this.emptyRatings = this.isEmpty(this.ratings);
      if(!this.emptyRatings){
        this.readComments(courseId,contentId);
      }
    });
  }
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  generateUrl(baseUrl:string,level?:number,last_id?:string){
    if(level && last_id){
      return baseUrl+`&level=${level}&last_id=${last_id}`;
    }
    if(level){
      return baseUrl+`&level=${level}`;
    }
    if(last_id){
      return baseUrl+`&last_id=${last_id}`;
    }
    return baseUrl;
  }

  readComments(courseId: string, contentId:string, level?:number):void{
    const baseUrl = `ratings/comments?courseId=${courseId}&contentId=${contentId}`;
    let url ="";
    if(level){
      url = baseUrl+`&level=${level}`;
    }
    else{
      url = baseUrl;
    }
    this.ratingService.sendToBackend(Service.COURSE_SERVICE, url, HttpMethod.GET, {}).then((response: any) => {
      if(!this.isEmpty(response.body)){
        if(level){
          this.comments = [];
        }
        this.comments = response.body.comments;
        this.last_id = response.body.last_id;
      }
    });
  }

  filterComment(level:number):void{
    if(this.level===level){
      // reset the filter
      this.level=0;
      this.comments = [];
      this.setDefaultOpacityAndTransform();
      this.readComments(this.courseId,this.contentId);
      return;
    }
    this.level = level;
    this.finished = false;
    this.setOpactiyAndTransform(level);
    this.readComments(this.courseId,this.contentId,level);
  }

  checkOpacity(level:number):boolean{
    return this.ratingOpactiy[level-1];
  }

  checkTransform(level:number):boolean{
    return this.ratingTransform[level-1];
  }

  setOpactiyAndTransform(level:number):void{
    for(let i=0;i<5;i++){
      this.ratingOpactiy[i]=true;
      this.ratingTransform[i]=false;
    }
    this.ratingOpactiy[level-1]=false;
    this.ratingTransform[level-1]=true;
  }

  setDefaultOpacityAndTransform():void{
    for(let i=0;i<5;i++){
      this.ratingOpactiy[i]=false;
      this.ratingTransform[i]=false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getMoreComments(courseId: string, contentId:string, last_id:any, level?:any):void{
    const baseUrl = `ratings/comments?courseId=${courseId}&contentId=${contentId}`;
    const url = this.generateUrl(baseUrl,level,last_id);
    if(!this.finished){
      this.ratingService.sendToBackend(Service.COURSE_SERVICE, url, HttpMethod.GET, {}).then((response: any) => {
        if(!this.isEmpty(response.body)){
          if(response.body.comments.length<=0){
            this.finished = true;
            return;
          }
          this.comments = [...this.comments,...response.body.comments];
          this.last_id = response.body.last_id;
        }
      });
    }
   
  }

  getStudentRating(courseId: string,contentId: string):void{
    this.ratingService.sendToBackend(Service.COURSE_SERVICE, `ratings?courseId=${courseId}&contentId=${contentId}`, HttpMethod.GET, {}).then((response: any) => {
      if(response.body.length>0){
        this.userComment = response.body[0];
        this.userRating = response.body[0].level;
        this.rating = true;
        this.getRatingMessage();
      }
    });
  }

  addStudentRating():void{
    if(this.editRating){
      this.editStudentRating();
      return;
    }
    if(this.userRating<4 && this.inputComment.length<1){
      this.ratingCompulsory = true;
      return;
    }
    const payload ={
      level: this.userRating,
      comment: this.inputComment
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.ratingService.sendToBackend(Service.COURSE_SERVICE, `ratings?courseId=${this.courseId}&contentId=${this.contentId}`, HttpMethod.POST, payload).then((response: any) => {
      this.showSuccessToast("Rating submitted Successfully");
      this.userComment = response.body;
      this.userRating = response.body.level;
      this.rating = true;
    });
 
  }

  editStudentRating():void{
    if(this.userRating<4 && this.inputComment.length<1){
      this.ratingCompulsory = true;
      return;
    }
    const payload ={
      level: this.userRating,
      comment: this.inputComment
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.ratingService.sendToBackend(Service.COURSE_SERVICE, `ratings?courseId=${this.courseId}&contentId=${this.contentId}`, HttpMethod.PUT, payload).then((response: any) => {
      this.showSuccessToast("Rating updated successfully");
      this.userComment.comment = response.body.comment;
      this.userComment.updatedOn = response.body.updatedOn;
      this.userRating = response.body.level;
      this.rating = true;
    });
   
  }

  cancelRating():void{
    this.showCommentBox=false;
    if(this.orginalRating.rating){
      this.userRating = this.orginalRating.rating;
      this.inputComment = this.orginalRating.comment;
      this.rating = true;
    }
    this.getRatingMessage();
  }

  showStudentRatingOnEdit():void{
    this.getRatingPlaceHolder();
    this.inputComment = this.userComment.comment;
    this.orginalRating.rating = this.userRating;
    this.orginalRating.comment = this.userComment.comment;
    this.showCommentBox = true;
    this.rating = false;
    this.editRating = true;
  }

  getRatingPlaceHolder():void{
    if(this.userRating<=3){
      this.ratingPlaceHolder = "contentRating.placeholders.badRating";
      this.ratingTitle ="contentRating.titles.badRating";
    }
    if(this.userRating>=4){
      this.ratingPlaceHolder = "contentRating.placeholders.goodRating";
      this.ratingTitle ="contentRating.titles.goodRating";
    }
  }

  ratingCount():string{
    if(this.ratings.totalCount > 1){
      return `${this.ratings.totalCount} ratings`;
    }
    return `${this.ratings.totalCount} rating`;
  }
  getRatingMessage():void{
    this.ratingMessage= `contentRating.ratingMessages.level${this.userRating}`;
  }

  RatingOnHover(index:number,type:string):void{
    if(!this.showCommentBox){
      if(type==="filled"){
        this.userRating = index+1;
        this.getRatingMessage();
        this.getRatingPlaceHolder();
      }
      else{
        this.userRating += index+1;
        this.getRatingMessage();
        this.getRatingPlaceHolder();
      }
    }
  }

  RatingOnClick(index:number,type:string):void{
    if(type==="filled"){
      this.userRating = index+1;
      this.getRatingMessage();
      this.getRatingPlaceHolder();
      this.showCommentBox=true;
    }
    else{
      this.userRating += index+1;
      this.getRatingMessage();
      this.getRatingPlaceHolder();
      this.showCommentBox=true;
    }
  }

  disableSubmitButton():boolean{
    if(!this.showCommentBox ){
      return true;
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  showSuccessToast(message: string) {
    this.toastService.success(message, '', {
      positionClass: 'toast-top-right',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  isEmpty(obj:any){
    if(obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype){
      return true;
    }
    return false;
  }

  ngOnDestroy():void{
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

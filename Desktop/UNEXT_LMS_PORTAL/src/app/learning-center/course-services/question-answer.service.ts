/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { StorageKey } from 'src/app/enums/storageKey';
import { HttpClientService } from 'src/app/services/http-client.service';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';

export interface InfiniteScrollFilterAttributes {
  limit: number,
  skip: number,
}

export interface QuestionResponseForQnAContentPane {
  questions: QuestionResponse[],
  totalQuestion: number,
}

export interface QuestionResponse {
  _id: string,
  numOfUpvotes: number,
  numOfAnswers: number,
  courseId: string,
  elementId: string,
  title: string,
  description: string,
  createdBy: string,
  updatedBy: string,
  questionId: string,
  createdAt: string,
  updatedAt: string,
  verifiedAnswerId?: string,
  contentBreadCrumb?: string,
  contentTitle?: string,
  contentType?: string,
  userName: string,
}

export interface QuestionResponseForQnADashboard extends QuestionResponse {
  numOfUpvotes: number,
  numOfAnswers: number,
  isFollowing: boolean,
  isPinned: boolean,
  isUpvoted: boolean,
  contentBreadCrumb: string,
  contentTitle: string,
  contentType: string,
  isContentDeleted? : string
}

export interface AnswerResponse {
  _id: string,
  parentAnswerId: string | null,
  numOfReplies: number,
  numOfUpvotes: number,
  questionId: string,
  elementId: string,
  answer: string,
  createdBy: string,
  updatedBy: string,
  answerId: string,
  createdAt: string,
  updatedAt: string,
  verifiedAt: string,
  verifiedBy: string,
  userName: string
}
@Injectable({
  providedIn: 'root'
})
export class QuestionAnswerService {
  courseId!: string | undefined;
  elementId!: string | undefined;
  questionAnswerOperations = new Subject();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private httpClientService: HttpClientService, private routeOperationService: RouteOperationService, private storageService: StorageService) {
    this.initCourseId();
  }
  async initCourseId(): Promise<void> {
    await this.routeOperationService.listen('courseId').subscribe((data) => {
      this.courseId = data;
    });
  }

  async initializeElementIdInService (id: string): Promise<void> {
    this.elementId = id;
  }

  async getFilteredQuestionsByElementId(elementId: string, filter: InfiniteScrollFilterAttributes = {
    limit: 5,
    skip: 0
  }): Promise<QuestionResponseForQnAContentPane> {
    const { limit, skip } = filter;
    const queryParams = new URLSearchParams({
      elementId,
      limit: String(limit),
      skip: String(skip),
    }).toString();
    const response = await this.httpClientService.getResponse(
      Service.COURSE_SERVICE,
      `qna/questions?${queryParams}`,
      HttpMethod.GET,
      true
    );
    return response.body;
  }

  async getFilteredAnswersByQuestionId(questionId: string, filter: InfiniteScrollFilterAttributes = {
    limit: 5,
    skip: 0
  }): Promise<AnswerResponse[]> {
    const { limit, skip } = filter;
    const queryParams = new URLSearchParams({
      questionId,
      limit: String(limit),
      skip: String(skip),
    }).toString();
    const response = await this.httpClientService.getResponse(
      Service.COURSE_SERVICE,
      `qna/answers?${queryParams}`,
      HttpMethod.GET,
      true
    );
    return response.body;
  }

  async getQuestions(elementId: string): Promise<any> {
    const question = await this.httpClientService.getResponse(Service.COURSE_SERVICE, `qna/questions?elementId=${elementId}&limit=5&skip=0`, HttpMethod.GET, {});
    return question.body;
  }
  async getQuestion(questionId: string): Promise<QuestionResponseForQnADashboard> {
    const question = await this.httpClientService.getResponse(Service.COURSE_SERVICE, `qna/questions/${questionId}?courseId=${this.courseId}`, HttpMethod.GET, {});
    return question;
  }
  async getQuestionsForQnaDashboard(filter: InfiniteScrollFilterAttributes = {
    limit: 5,
    skip: 0
  }): Promise<QuestionResponseForQnADashboard[]> {
    const { limit, skip } = filter;
    const queryParams = new URLSearchParams({
      courseId: String(this.courseId),
      limit: String(limit),
      skip: String(skip),
    }).toString();
    const response = await this.httpClientService.getResponse(
      Service.COURSE_SERVICE,
      `qna/questions?${queryParams}`,
      HttpMethod.GET,
      true
    );
    return response.body;
  }

  async getAnswers(questionId: string, limit: number, skip: number, firstLevelAnswerId?: string): Promise<any> {
    let url = `qna/answers?questionId=${questionId}&limit=${limit}&skip=${skip}`;
    if (firstLevelAnswerId) {
      url = `qna/answers?questionId=${questionId}&firstLevelAnswerId=${firstLevelAnswerId}&limit=${limit}&skip=${skip}`;
    }
    const answer = await this.httpClientService.getResponse(Service.COURSE_SERVICE, `${url}`, HttpMethod.GET, {});
    return answer.body;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async giveReply(payLoad: any): Promise<any> {
    return await this.httpClientService.getResponse(Service.COURSE_SERVICE, `qna/answers`, HttpMethod.POST, payLoad);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async askQuestion(question: any): Promise<any> {
    const elementId = this.storageService.get(StorageKey.ELEMENT_ID);
    const payLoad = {
      courseId: this.courseId,
      elementId: elementId,
      title: question.title,
      description: question.description
    };
    const response = await this.httpClientService.getResponse(Service.COURSE_SERVICE, `qna/questions`, HttpMethod.POST, payLoad);
    if(response.status === 200) {
      return response.body;
    }
    return false;
    
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async updateQuestion(questionId: string, question: any): Promise<any> {
    return await this.httpClientService.getResponse(Service.COURSE_SERVICE, `qna/questions/${questionId}`, HttpMethod.PUT, question);
  }

  async updateAnswer(answerId: string, answer: string): Promise<any> {
    return await this.httpClientService.getResponse(Service.COURSE_SERVICE, `qna/answers/${answerId}`, HttpMethod.PUT, {
      answer: answer
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async vote(answerId: string, payLoad: any): Promise<any> {
    return await this.httpClientService.getResponse(Service.COURSE_SERVICE, `qna/user-interactions/${answerId}`, HttpMethod.PUT, payLoad);
  }

  async deleteQuestion(questionId: string): Promise<any> {
    return await this.httpClientService.getResponse(Service.COURSE_SERVICE, `qna/questions/${questionId}`, HttpMethod.DELETE, {});
  }

  async deleteAnswer(answerId: string): Promise<any> {
    return await this.httpClientService.getResponse(Service.COURSE_SERVICE, `qna/answers/${answerId}`, HttpMethod.DELETE, {});
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async toggleVerifyAnswer(answerId: string, isVerified: any): Promise<any> {
    return await this.httpClientService.getResponse(Service.COURSE_SERVICE, `qna/answers/${answerId}`, HttpMethod.PUT, isVerified);
  }
}

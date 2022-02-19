/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProgressOperations } from 'src/app/enums/progressOperations';
import { RouteOperationService } from 'src/app/services/route-operation.service';

@Component({
  selector: 'app-top-bottom-progress-list',
  templateUrl: './top-bottom-progress-list.component.html',
  styleUrls: ['./top-bottom-progress-list.component.scss']
})
export class TopBottomProgressListComponent implements OnInit {
  @Input() type!:string
  @Input() studentList: any = [];
  @Output() listClick = new EventEmitter();

  courseId!:string
  topList: any = [];
  bottomList: any = [];
  listType = 'top';
  private unsubscribe$ = new Subject<void>();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private activateRoute: ActivatedRoute,private router: Router, private routeOperationService: RouteOperationService) { }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {
    this.routeOperationService.listenParams().pipe(takeUntil(this.unsubscribe$)).subscribe((params: any) => {
      this.courseId = params.courseId;
    });
  }
  clickEvent(type: string): void {
    switch (type) {
      case ProgressOperations.TOP:
        this.listType = type;
        this.listClick.emit(type);
        break;
      case ProgressOperations.BOTTOM:
        this.listType = type;
        this.listClick.emit(type);
        break;
    }
  }
  onClick(): void {
    this.router.navigate([`learning-center/${this.courseId}/progress-list-view`], { queryParamsHandling: 'merge'});
  }
}

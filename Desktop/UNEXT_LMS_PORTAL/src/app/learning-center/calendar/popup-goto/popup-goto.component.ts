import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RouteOperationService } from 'src/app/services/route-operation.service';

@Component({
  selector: 'app-popup-goto',
  templateUrl: './popup-goto.component.html',
  styleUrls: ['./popup-goto.component.scss']
})
export class PopupGotoComponent implements OnInit {

  $unsubscribe = new Subject<void>();
  courseId!: string;
  constructor(private routeOperation: RouteOperationService,private router: Router, private activateRoute: ActivatedRoute) { }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any = {};
  @Output() cancelStatus = new EventEmitter()

  ngOnInit(): void {
    this.routeOperation.listen('courseId').pipe(takeUntil(this.$unsubscribe)).subscribe(courseId=>{
      this.courseId = courseId;
    });
  }
  
  clickEvent(type: string): void{
    switch (type) {
      case 'goToContent':
        // eslint-disable-next-line no-console
        switch(this.params.meta.type) {
          case "discussion-forum":
            this.router.navigate([`../../../learning-center/${this.courseId}/discussion-forums/forum-detail/${this.params.id}`], { relativeTo: this.activateRoute ,queryParamsHandling: 'preserve'});
            break;
        }
        break;
      default:
        break;
    }
    this.cancelStatus.emit(true);
  }
}

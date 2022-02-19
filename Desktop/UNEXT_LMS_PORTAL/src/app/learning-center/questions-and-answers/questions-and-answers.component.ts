import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';
import { ScreenSizeKey } from 'src/app/enums/screenSizeKey';
import { StorageKey } from 'src/app/enums/storageKey';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-questions-and-answers',
  templateUrl: './questions-and-answers.component.html',
  styleUrls: ['./questions-and-answers.component.scss']
})
export class QuestionsAndAnswersComponent implements OnInit {
  isMobileOrTablet = false;
  screenType!: string;
  isRightPaneActive = true;
  constructor(private storageService: StorageService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.detectChanges();
  }

  detectChanges(): void {
    this.storageService.listen(StorageKey.CURRENT_DEVICE).pipe(distinctUntilChanged()).subscribe((screenType: string) => {
      this.screenType = screenType;
      switch (screenType) {
        case ScreenSizeKey.TABLET:
          this.isMobileOrTablet = true;
          if(this.route.snapshot.paramMap.get('questionId') !== null) {
            this.isRightPaneActive = true;
          }
          break;
        case ScreenSizeKey.MOBILE:
          this.isMobileOrTablet = true;
          if(this.route.snapshot.paramMap.get('questionId') !== null) {
            this.isRightPaneActive = true;
          }
          break;
        default:
          this.isMobileOrTablet = false;
          this.isRightPaneActive = true;
          break;
      }
    });
  }

  goBack(): void {
    this.togglePanel(false);
    this.router.navigate(['./'], { relativeTo: this.route, queryParamsHandling: 'merge' });
  }

  togglePanel(isLeftPanelClicked: boolean): void {
    this.isRightPaneActive = isLeftPanelClicked;
  }
}

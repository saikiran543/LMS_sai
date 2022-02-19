/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb';
import { NotesService } from '../../course-services/notes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { StorageService } from 'src/app/services/storage.service';
import { distinctUntilChanged } from 'rxjs';
import { ScreenSizeKey } from 'src/app/enums/screenSizeKey';
import { StorageKey } from 'src/app/enums/storageKey';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notes: any;
  isMobileOrTablet = false;
  screenType!: string;
  isRightPaneActive = true;

  // eslint-disable-next-line max-params
  constructor(private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService,
    private notesService: NotesService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private leftNavService: LeftNavService,
    private storageService: StorageService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.detectChanges();
    const breadcrumb = { semester: 'semester1', note: 'Note' };
    this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.notesService.notes.subscribe((data: any) => {
      this.notes = data;
    });
    this.router.navigate([], { relativeTo: this.activateRoute, queryParams: { courseDropDown: false, toc: false }, queryParamsHandling: 'merge' });
    this.leftNavService.messageEmitter.next(false);
  }

  detectChanges(): void {
    this.storageService.listen(StorageKey.CURRENT_DEVICE).pipe(distinctUntilChanged()).subscribe((screenType: string) => {
      this.screenType = screenType;
      switch (screenType) {
        case ScreenSizeKey.TABLET:
          this.isMobileOrTablet = true;
          if (this.route.snapshot.paramMap.get('noteId') !== null) {
            this.isRightPaneActive = true;
          }
          break;
        case ScreenSizeKey.MOBILE:
          this.isMobileOrTablet = true;
          if (this.route.snapshot.paramMap.get('noteId') !== null) {
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

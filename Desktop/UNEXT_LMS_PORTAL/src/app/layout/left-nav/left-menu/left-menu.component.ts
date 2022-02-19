/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { filter } from 'rxjs';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/enums/storageKey';
@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent {
  isInitialize: any;
  leftMenu: any = [];
  topMenu: any = [];
  bottomMenu: any = [];
  slideMenuTitle: any;
  selectedMenu: any;
  toc: any;
  courseId: any;
  tocContent = false;
  constructor(private routeOperationService: RouteOperationService, private router: Router, private activatedRoute: ActivatedRoute, private leftNavService: LeftNavService, private storageService: StorageService) {
    this.toc = leftNavService;
    this.router.events.pipe(filter((event)=>event instanceof NavigationEnd)).subscribe(()=>{
      this.activateSlideMenuItems();
    });
  }
  
  ngOnInit(): void {
    this.leftNavService.messageEmitter.subscribe(toc=>{
      this.tocContent = toc;
    });
    this.activatedRoute.queryParamMap.subscribe((urlQueryParams: any) => {
      this.initializeMenu(urlQueryParams.params);
      if(urlQueryParams.params.toc === "true"){
        this.tocContent = true;
      }else{
        this.tocContent = false;
      }
    });
  }

  ngAfterViewInit(): void{
    this.activatedRoute.queryParamMap.subscribe((params: any) => {
      const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
      if(params.params.toc && snapshot?.root.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.params.id){
        setTimeout(() => {
          this.leftNavService.messageEmitter.next(true);
          this.leftNavService.nodeDetailsEmitter.next(snapshot?.root.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.params.id);
        }, 1000);
      }
    }
    );
  }
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async initializeMenu(params: any): Promise<void> {
    this.isInitialize = params.leftMenu ? JSON.parse(params.leftMenu) : false;
    if (this.isInitialize) {
      this.leftMenu = await this.leftNavService.getLeftMenuItems(params.id);
      this.topMenu = this.leftMenu.filter((item: any) => item.position === 'top');
      this.bottomMenu = this.leftMenu.filter((item: any) => item.position === 'bottom');
      this.slideMenuTitle = this.leftNavService.getTitle(params.id);
      this.activateSlideMenuItems();
    }
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async clickEvent(item: any) {
    this.routeOperationService.listen('courseId').subscribe((data) => {
      this.courseId = data;
    });
    const listComponentRoute = await this.storageService.get(StorageKey.SIDEBAR_ACTIVE_COMPONENT_ROUTE);
    if (item.route && this.courseId) {
      await this.router.navigate([`./${this.courseId}/${item.route}`], {relativeTo: listComponentRoute ,queryParamsHandling: "merge" });
    }
    else{
      await this.router.navigate([`./${item.route}`], {relativeTo: listComponentRoute ,queryParamsHandling: "merge" });
    }
    this.activateSlideMenuItems();
  }
  activateSlideMenuItems(): void {
    // const routerParam = this.router.url.split(/[/, ?]+/)[1];
    this.leftMenu.forEach((element: any) => {
      if (this.router.url.includes(element.route)) {
        element.active = true;
      }
      else {
        element.active = false;
      }
    });
  }
}

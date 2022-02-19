/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LeftNavService } from 'src/app/services/left-nav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private leftNavService: LeftNavService
  ) { }

  topMenu: any = [];
  bottomMenu: any = [];
  sideBarItems: any = [];
  async ngOnInit(): Promise<void> {
    await this.initializeSideBar();
    this.activateSideBarItems();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async onClick(selectedItem: any): Promise<void> {
    const queryParams: any = { leftMenu: selectedItem.leftMenu, id: selectedItem.id };
    //const activeQueryParams = JSON.parse(JSON.stringify(this.activeRoute.snapshot.queryParams));
    // if (activeQueryParams && selectedItem.leftMenu && selectedItem.id === activeQueryParams.id) {
    //   activeQueryParams.leftMenu = !JSON.parse(activeQueryParams.leftMenu);
    //   queryParams = activeQueryParams;
    // }
    this.router.navigate([selectedItem.route], {
      queryParams: queryParams,
    });
  }

  async initializeSideBar(): Promise<void> {
    this.sideBarItems = await this.leftNavService.getSideBarItems();
    this.topMenu = this.sideBarItems.filter((item: any) => item.position === 'top');
    this.bottomMenu = this.sideBarItems.filter((item: any) => item.position === 'bottom');
  }

  activateSideBarItems(): void {
    this.activeRoute.queryParams.pipe(filter(params => Object.keys(params).length > 0)).subscribe(params => {
      this.sideBarItems.forEach((element: any) => {
        if (element.id === params.id) {
          element.active = true;
        }
        else {
          element.active = false;
        }
      });
    });

  }
}
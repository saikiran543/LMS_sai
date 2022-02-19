import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { StorageKey } from '../../../enums/storageKey';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss']
})
export class ContentHeaderComponent {

  title = '';
  view!: string;
  previewModeOfTree = false;
  courseDropDown: string | undefined;
  constructor(private route: ActivatedRoute, private router: Router, private storageService: StorageService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.route))
      .pipe(map((route) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }))
      .pipe(filter(route => route.outlet === PRIMARY_OUTLET))
      .subscribe(route => {
        this.title = route.snapshot.data.title;
      });
    this.view = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    this.route.queryParams.subscribe(params => {
      this.courseDropDown = params.courseDropDown;
    });
  }

  ngOnInit(): void{
    this.storageService.listen('previewMode').subscribe((data)=>{
      this.previewModeOfTree = data;
    });
  }
}


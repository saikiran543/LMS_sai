import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isSlideMenu : any;
  constructor(private router: Router, private activeRoute: ActivatedRoute) {

  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async ngOnInit() {
    this.isSlideMenu = this.activeRoute.queryParamMap.pipe(
      map((params) => {
        const value = params.get('leftMenu');
        return value ? value === 'true' : false;
      })
    );
  }
}

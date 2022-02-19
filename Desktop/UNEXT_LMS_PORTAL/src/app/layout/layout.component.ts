import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  constructor(private router : Router,private activatedRoute: ActivatedRoute){

  }
  @HostListener('window:resize', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  onResize(event: any): void {
    if (event.target.innerWidth <= 1048) {
      this.router.navigate([],{relativeTo: this.activatedRoute, queryParams: {leftMenu: false},queryParamsHandling: 'merge'});
    }
  }

}

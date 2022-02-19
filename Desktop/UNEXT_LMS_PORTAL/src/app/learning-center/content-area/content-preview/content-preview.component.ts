import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-content-preview',
  templateUrl: './content-preview.component.html',
  styleUrls: ['./content-preview.component.scss']
})
export class ContentPreviewComponent implements OnInit {
  isLeftOpen = true;
  preview: boolean | undefined;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(filter(params => Object.keys(params).length > 0)).subscribe(params => {
      this.preview = params.preview;
      const value = params.leftMenu;
      if (value === 'true') {
        this.isLeftOpen = true;
      } else {
        this.isLeftOpen = false;
      }
      if (this.preview) {
        this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: { courseDropDown: 'false' }, queryParamsHandling: 'merge' });
      }
    });
  }

  closePreview(): void {
    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: { preview: 'false' }, queryParamsHandling: 'merge' });
  }

}

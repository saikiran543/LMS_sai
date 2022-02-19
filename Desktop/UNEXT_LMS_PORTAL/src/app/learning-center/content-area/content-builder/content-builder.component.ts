import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ContentBuilderService } from '../../course-services/content-builder.service';
@Component({
  selector: 'app-content-builder',
  templateUrl: './content-builder.component.html',
  styleUrls: ['./content-builder.component.scss']
})
export class ContentBuilderComponent {
  orgId!: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentTypeList: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activityTypeList: any;

  queryParams= {}

  constructor(private router: Router, private activateRoute: ActivatedRoute, private configuration: ConfigurationService, private contentBuilder: ContentBuilderService) {
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async ngOnInit() {
    this.orgId = this.configuration.getAttribute("orgId");
    this.contentTypeList = await this.contentBuilder.getContentBuilder(this.orgId, "content");
    this.activityTypeList = await this.contentBuilder.getContentBuilder(this.orgId, "activity");
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
  onclick(item: any): void {
    if(item.name !=='liveclassroom'){
      this.router.navigate(['./list/manipulate/create/' + item.name], { relativeTo: this.activateRoute,queryParams: {rightNav: null}, queryParamsHandling: 'merge' ,replaceUrl: true});
    }
  }

  close(): void {
    this.router.navigate([], { relativeTo: this.activateRoute, queryParams: {rightNav: null}, queryParamsHandling: 'merge' });
  }
}

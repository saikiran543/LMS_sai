import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageKey } from 'src/app/enums/storageKey';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedCourseDetails : null | any = null;
  constructor(private storageService : StorageService, private router: Router, private activatedRoute : ActivatedRoute){}
  async ngOnInit(): Promise<void>{
    this.selectedCourseDetails = await this.storageService.get(StorageKey.COURSE_LIST_SELECTION);
    if(!this.selectedCourseDetails){
      // make call to backend to get details for now giving static course
      this.selectedCourseDetails = {
        title: 'Crash Course in Account & Finance',
        tags: ['UI Design','AutoCad', 'Photoshop',],
        facultyName: 'Harry Garza',
        status: 40,
        id: '1142'
      };
    }
  }
  goToContentArea(): void{
    this.router.navigate([ '../content-area'], { relativeTo: this.activatedRoute, queryParams: {leftMenu: true},queryParamsHandling: 'merge'});
  }
}

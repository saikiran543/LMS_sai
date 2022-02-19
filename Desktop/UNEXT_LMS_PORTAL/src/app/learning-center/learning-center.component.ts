import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageKey } from '../enums/storageKey';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-learning-center',
  templateUrl: './learning-center.component.html',
  styleUrls: ['./learning-center.component.scss']
})
export class LearningCenterComponent {

  view!: string;
  previewModeOfTree= false;
  constructor(private storageService: StorageService,private router: Router, private activateRoute: ActivatedRoute) {
    this.view = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
  }
  ngOnInit(): void{
    this.storageService.set(StorageKey.SIDEBAR_ACTIVE_COMPONENT_ROUTE, this.activateRoute);
    this.storageService.listen('previewMode').subscribe((data)=>{
      this.previewModeOfTree = data;
    });
  }

}

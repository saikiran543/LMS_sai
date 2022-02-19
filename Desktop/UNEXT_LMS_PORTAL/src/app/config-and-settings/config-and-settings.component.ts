import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageKey } from '../enums/storageKey';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-config-and-settings',
  template: '<router-outlet> </router-outlet>',
})
export class ConfigAndSettingsComponent {

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

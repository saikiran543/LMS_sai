/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Input, OnInit } from '@angular/core';
import { ProgressOperations } from 'src/app/enums/progressOperations';
import { StorageKey } from 'src/app/enums/storageKey';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() type!:string
  view!: string;
  title!: string;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private storageService: StorageService) { }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {
    this.loadDependencies();
  }

  loadDependencies(): void {
    this.view = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    this.getTitle(this.type);
  }
  getTitle(type:string): void {
    switch (type) {
      case ProgressOperations._MY_PROGRESS:
        this.title = ProgressOperations.MY_PROGRESS;
        break;
      case ProgressOperations._CLASS_PROGRESS:
        this.title = ProgressOperations.CLASS_PROGRESS;
        break;
      default:
        break;
    }
  }

}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageKey } from 'src/app/enums/storageKey';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router,private storageService: StorageService){

  }
  logout(): void{
    localStorage.clear();
    this.storageService.clearData([StorageKey.COURSE_JSON,StorageKey.DOC_VERSION,StorageKey.ELEMENT_DETAIL,StorageKey.JWT_TOKEN_DATA,StorageKey.USER_CURRENT_VIEW,StorageKey.USER_DETAILS]);
    this.router.navigate(['login']);
  }
}

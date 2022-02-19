/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LeftNavService } from 'src/app/services/left-nav.service';

import { LeftMenuComponent } from './left-menu.component';

describe('LeftMenuComponent', () => {
  let component: LeftMenuComponent;
  let fixture: ComponentFixture<LeftMenuComponent>;
  let leftNavService: LeftNavService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule],
      declarations: [LeftMenuComponent],
      providers: [LeftNavService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    leftNavService = TestBed.inject(LeftNavService);
    fixture = TestBed.createComponent(LeftMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should should render the expected html', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leftMenu: any = [
      {
        id: 'loginpage',
        icon: 'assets/images/icons/icon-loginpage.svg',
        displayName: 'Login Page',
        authorizationReqd: true,
      },
      {
        id: 'brandingpage',
        icon: 'assets/images/icons/icon-brandingpage.svg',
        displayName: 'Branding Page',
        authorizationReqd: true,
      },
      {
        id: 'emailtemplatepage',
        icon: 'assets/images/icons/icon-emailtemplate.svg',
        displayName: 'Email Template Page',
        authorizationReqd: false,
      },
    ];
    spyOn(leftNavService, 'getLeftMenuItems').and.resolveTo(leftMenu);
    spyOn(leftNavService, 'getTitle').and.returnValue('Login & Settings');
    await component.initializeMenu({ leftMenu: true, id: 'loginangsettings' });
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.slide-menu-title').textContent).toContain('Login & Settings');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allLiTag: any = compiled.querySelectorAll('.layout-item-center');
    expect(allLiTag[0].querySelector('span').textContent).toContain(leftMenu[0].displayName);
    expect(allLiTag[0].querySelector('img').src).toContain(leftMenu[0].icon);
    expect(allLiTag[1].querySelector('span').textContent).toContain(leftMenu[1].displayName);
    expect(allLiTag[1].querySelector('img').src).toContain(leftMenu[1].icon);
    expect(allLiTag[2].querySelector('span').textContent).toContain(leftMenu[2].displayName);
    expect(allLiTag[2].querySelector('img').src).toContain(leftMenu[2].icon);
  });
});

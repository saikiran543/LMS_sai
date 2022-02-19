/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let leftNavService: LeftNavService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule],
      declarations: [SidebarComponent],
      providers: [LeftNavService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    leftNavService = TestBed.inject(LeftNavService);
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the expected top menu html rendering', async () => {
    const sidebarItems = [
      {
        id: 'dashboard',
        icon: 'assets/images/icons/icon-dashboard.svg',
        displayName: 'Dashboard',
        position: 'top',
        authorizationReqd: true,
        leftMenu: false,
        title: '',
      },
      {
        id: 'communities',
        icon: 'assets/images/icons/icon-learningcentre.svg',
        displayName: '',
        position: 'top',
        authorizationReqd: true,
        leftMenu: true,
        title: 'Communities',
      },
      {
        id: 'configandsettings',
        icon: 'assets/images/icons/icon-configandsettings.png',
        displayName: '',
        position: 'bottom',
        authorizationReqd: true,
        leftMenu: true,
        title: 'Config & Settings',
      },
    ];
    spyOn(leftNavService, 'getSideBarItems').and.resolveTo(sidebarItems);
    const spyOnOnClick = spyOn(component, 'onClick');
    await component.initializeSideBar();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allLiTag: any = compiled.querySelectorAll('.sidebar-top-menu>li');
    expect(allLiTag[0].textContent).toContain(sidebarItems[0].displayName);
    expect(allLiTag[0].querySelector('img').src).toContain(sidebarItems[0].icon);
    expect(allLiTag[1].textContent).toContain(sidebarItems[1].displayName);
    expect(allLiTag[1].querySelector('img').src).toContain(sidebarItems[1].icon);
    allLiTag[0].click();
    expect(spyOnOnClick).toHaveBeenCalled();
  });

  it('should check the expected botton menu html rendering', async () => {
    const sidebarItems = [
      {
        id: 'dashboard',
        icon: 'assets/images/icons/icon-dashboard.svg',
        displayName: 'Dashboard',
        position: 'top',
        authorizationReqd: true,
        leftMenu: false,
        title: '',
      },
      {
        id: 'communities',
        icon: 'assets/images/icons/icon-learningcentre.svg',
        displayName: '',
        position: 'top',
        authorizationReqd: true,
        leftMenu: true,
        title: 'Communities',
      },
      {
        id: 'configandsettings',
        icon: 'assets/images/icons/icon-configandsettings.png',
        displayName: '',
        position: 'bottom',
        authorizationReqd: true,
        leftMenu: true,
        title: 'Config & Settings',
      },
    ];
    spyOn(leftNavService, 'getSideBarItems').and.resolveTo(sidebarItems);
    const spyOnOnClick = spyOn(component, 'onClick');
    await component.initializeSideBar();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allLiTag: any = compiled.querySelectorAll('.sidebar-bottom-menu>li');
    expect(allLiTag[0].textContent).toContain(sidebarItems[2].displayName);
    expect(allLiTag[0].querySelector('img').src).toContain(sidebarItems[2].icon);
    allLiTag[0].click();
    expect(spyOnOnClick).toHaveBeenCalled();
  });

});

/* eslint-disable @typescript-eslint/no-empty-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressOperations } from 'src/app/enums/progressOperations';
import { StorageService } from 'src/app/services/storage.service';
import { FilterComponent } from '../../progress/filter/filter.component';
import { HeaderComponent } from './header.component';
describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let storageService: StorageService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent, FilterComponent ],
      providers: [StorageService]
    }).compileComponents();
  });

  beforeEach(() => {
    HeaderComponent.prototype.ngOnInit = () => {};
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.type = ProgressOperations._CLASS_PROGRESS;
    storageService = TestBed.inject(StorageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should intialize', () => {
    component.type = ProgressOperations._MY_PROGRESS;
    spyOn(storageService, 'get').and.resolveTo("student");
    component.ngOnInit();
    fixture.detectChanges();
  });
  it('should load dependencies', () => {
    component.type = ProgressOperations._CLASS_PROGRESS;
    spyOn(storageService, 'get').and.resolveTo("student");
    component.loadDependencies();
    fixture.detectChanges();
  });
  it('should render UI', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.getTitle(ProgressOperations._CLASS_PROGRESS);
    fixture.detectChanges();
    expect(compiled.querySelector('h5').textContent).toBeTruthy(ProgressOperations.CLASS_PROGRESS);
    component.getTitle(ProgressOperations._MY_PROGRESS);
    fixture.detectChanges();
    expect(compiled.querySelector('h5').textContent).toBeTruthy(ProgressOperations.MY_PROGRESS);
  });
});

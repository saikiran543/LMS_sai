import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastContainerDirective, ToastrModule, ToastrService } from 'ngx-toastr';

import { ToastComponent } from './toast.component';

// eslint-disable-next-line max-lines-per-function
describe('ToastComponent', () => {
  // let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  // let toastService: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToastComponent],
      providers: [ToastrService, ToastContainerDirective],
      imports: [ToastrModule.forRoot(), BrowserAnimationsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastComponent);
    // component = fixture.componentInstance;
    fixture.detectChanges();
    // toastService = TestBed.inject(ToastrService);
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should call the error function', () => {
  //   component.type = 'error';
  //   component.heading = 'Heading';
  //   component.message = 'This is a message';
  //   component.toastNumber = 1;
  //   component.openToastContainer();
  //   fixture.detectChanges();
  //   const opened = component.error();
  //   expect(opened).toBeDefined();
  //   expect(opened.toastId).toEqual(1);
  // });

  // it('should call the success function', () => {
  //   component.type = 'success';
  //   component.heading = 'Heading';
  //   component.message = 'This is a message';
  //   component.toastNumber = 1;
  //   component.openToastContainer();
  //   fixture.detectChanges();
  //   const opened = component.error();
  //   expect(opened).toBeDefined();
  //   expect(opened.toastId).toEqual(1);
  // });

  // it('should call the show function', () => {
  //   const compiled = fixture.debugElement.nativeElement;
  //   // component.heading = 'Heading';
  //   // component.message = 'This is a message';
  //   // component.toastNumber = 1;
  //   // component.type = 'error';
  //   const opened: ActiveToast<Toast> | null = component.openToastContainer();
  //   console.log(opened);

  //   fixture.detectChanges();
  //   // const opened: ActiveToast<Toast> = component.error();
  //   console.log(toastService.remove(1));
  //   expect(opened).toBeDefined();
  //   // expect(opened?.toastId).toEqual(1);
  //   console.log(compiled.querySelector('span'));
  //   opened?.onShown.toPromise().then(() => {
  //     console.log(compiled.querySelector('span'));
  //     console.log('done');
  //   });

  // opened.onShown.toPromise().then(() => {
  //   console.log('done');
  // });

  // opened?.onShown.toPromise().then((res: any) => {
  //   console.log(res);
  // });
  // });
});

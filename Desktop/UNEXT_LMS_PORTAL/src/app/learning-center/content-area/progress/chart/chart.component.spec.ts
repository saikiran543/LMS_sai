/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { GaugeChartModule } from 'angular-gauge-chart';
import { Observable, of } from 'rxjs';
import { ProgressOperations } from 'src/app/enums/progressOperations';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import translations from '../../../../../assets/i18n/en.json';
import { ChartComponent } from './chart.component';
class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}
describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;
  let translate: TranslateService;
  const routes: Routes = [{ path: 'login', component: LoginLayoutComponent }];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartComponent ],
      imports: [GaugeChartModule, HttpClientTestingModule, RouterTestingModule.withRoutes(routes), TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      })],
      providers: [TranslateService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    component.progressType = ProgressOperations._MY_PROGRESS;
    component.progressValue = 40;
    component.isMyProgressLess = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    fixture.detectChanges();
  });
  
  it('should load the type of progress', () => {
    component.progressType = ProgressOperations._CLASS_PROGRESS;
    component.getType(component.progressType);
    expect(component.progressType).toBe(ProgressOperations.CLASS_PROGRESS);
    expect(component.description).toBe(ProgressOperations.CLASS_AVERAGE);
    expect(component.progressText).toBe(ProgressOperations.OVERALL_PROGRESS);
    component.progressType = ProgressOperations._CLASS_AVERAGE;
    component.getType(component.progressType);
    expect(component.progressType).toBe(ProgressOperations.CLASS_AVERAGE);
    expect(component.description).toBe(ProgressOperations.CLASS_AVERAGE);
    expect(component.progressText).toBe(ProgressOperations.ON_PROGRESS);
  });

  it('should set appropriate Color for the progress graph', () => {
    let color;
    component.progressType = ProgressOperations.CLASS_AVERAGE;
    color = component.getColor(ProgressOperations.NEEDLE_COLOR);
    expect(color).toBe('#043C77');
    component.progressType = ProgressOperations.MY_PROGRESS;
    color = component.getColor(ProgressOperations.NEEDLE_COLOR);
    expect(color).toBe('#FFFFFF');
    component.progressType = ProgressOperations.CLASS_AVERAGE;
    color = component.getColor(ProgressOperations.PROGRESS_COLOR);
    expect(color).toBe('#043C77');
    component.progressType = ProgressOperations.MY_PROGRESS;
    component.isMyProgressLess = true;
    color = component.getColor(ProgressOperations.PROGRESS_COLOR);
    expect(color).toBe('#FFEF23');
    component.progressType = ProgressOperations.CLASS_PROGRESS;
    component.isMyProgressLess = false;
    color = component.getColor(ProgressOperations.PROGRESS_COLOR);
    expect(color).toBe('#4AD395');
    component.progressType = ProgressOperations.CLASS_AVERAGE;
    color = component.getColor(ProgressOperations.ARC_COLOR);
    expect(color).toBe('#FFFFFF');
    component.progressType = ProgressOperations.CLASS_PROGRESS;
    color = component.getColor(ProgressOperations.ARC_COLOR);
    expect(color).toBe('#1A528C');
  });

  it('should get progress value', () => {
    component.progressValue = 100;
    let progress;
    progress = component.getProgress();
    expect(progress).toBe(99.99);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('span').textContent).toBeTruthy(100);
    component.progressValue = 0;
    progress = component.getProgress();
    expect(progress).toBe(0.005);
    expect(compiled.querySelector('span').textContent).toBeTruthy(0);
    component.progressValue = 110;
    progress = component.getProgress();
    expect(progress).toBe(99.99);
    component.progressValue = -1;
    progress = component.getProgress();
    expect(progress).toBe(0.005);
  });

  it('should render the UI', () => {
    component.progressValue = 40;
    component.getType(ProgressOperations._MY_PROGRESS);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h4').textContent).toBeTruthy(ProgressOperations.MY_PROGRESS);
    expect(compiled.querySelector('span').textContent).toBeTruthy('40%');
    expect(compiled.querySelector('h6').textContent).toBeTruthy(ProgressOperations.ON_PROGRESS);
    expect(compiled.querySelector('p').textContent).toBeTruthy(`This tracker is for ${ProgressOperations.MY_COURSE} progress tracking`);

  });
});

import { TestBed } from '@angular/core/testing';

import { HttpClientInterceptor } from './http-interceptor.interceptor';

xdescribe('HttpClientInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
  }));

  it('should be created', () => {
    const interceptor: HttpClientInterceptor = TestBed.inject(HttpClientInterceptor);
    expect(interceptor).toBeTruthy();
  });

});

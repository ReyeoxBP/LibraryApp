import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerInterceptor } from './spinner.interceptor';

describe('SpinnerInterceptor', () => {
  let interceptor: SpinnerInterceptor;
  let spinnerService: NgxSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SpinnerInterceptor,
        { provide: NgxSpinnerService, useValue: { show: jest.fn(), hide: jest.fn() } }
      ]
    });

    interceptor = TestBed.inject(SpinnerInterceptor);
    spinnerService = TestBed.inject(NgxSpinnerService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should show and hide spinner when intercepting requests', () => {
    const request = new HttpRequest<any>('GET', '/api/data');
    const next: HttpHandler = {
      handle: (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        // Simulate request handling
        return of({} as HttpEvent<any>);
      }
    };

    interceptor.intercept(request, next).subscribe(() => {
      expect(spinnerService.show).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
    });
  });
});

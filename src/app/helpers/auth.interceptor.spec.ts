import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TokenStorageService } from '../services/auth/token-storage.service';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let tokenStorageService: TokenStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: TokenStorageService, useValue: { getToken: jest.fn() } }
      ]
    });

    interceptor = TestBed.inject(AuthInterceptor);
    tokenStorageService = TestBed.inject(TokenStorageService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add authorization header when intercepting requests with token', () => {
    const token = 'dummy_token';
    const request = new HttpRequest<any>('GET', '/api/data');
    const next: HttpHandler = {
      handle: (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        // Simulate request handling
        return of({} as HttpEvent<any>);
      }
    };

    jest.spyOn(tokenStorageService, 'getToken').mockReturnValue(token);

    interceptor.intercept(request, next).subscribe(() => {
      expect(request.headers.has('Authorization')).toBe(true);
      expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    });
  });

  it('should not add authorization header when intercepting requests without token', () => {
    const request = new HttpRequest<any>('GET', '/api/data');
    const next: HttpHandler = {
      handle: (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        // Simulate request handling
        return of({} as HttpEvent<any>);
      }
    };

    jest.spyOn(tokenStorageService, 'getToken').mockReturnValue(null);

    interceptor.intercept(request, next).subscribe(() => {
      expect(request.headers.has('Authorization')).toBe(false);
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { User } from '../../models/user';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send a POST request with username and password', () => {
      const username = 'testuser';
      const password = 'testpassword';

      service.login(username, password).subscribe();

      const req = httpMock.expectOne('http://localhost:3001/users/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username, password });

      req.flush({});
    });
  });

  describe('register', () => {
    it('should send a POST request with the user object', () => {
      const user: User = {
        name: 'testuser',
        password: 'testpassword',
        email: 'testuser@example.com',
        category: [1,2,3]
      };

      service.register(user).subscribe();

      const req = httpMock.expectOne('http://localhost:3001/users/create');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(user);

      req.flush({});
    });
  });
});

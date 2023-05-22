import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User } from '../../models/user';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send a POST request to login endpoint with the provided credentials', () => {
    // Arrange
    const username = 'testuser';
    const password = 'testpassword';

    // Act
    authService.login(username, password).subscribe();

    // Assert
    const req = httpMock.expectOne('http://localhost:3001/users/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username, password });
  });

  it('should send a POST request to register endpoint with the provided user', () => {
    // Arrange
    const user: User = { name: 'Eduardo', email: 'johndoe@example.com', category: [], password: 'UsernamePass' };

    // Act
    authService.register(user).subscribe();

    // Assert
    const req = httpMock.expectOne('http://localhost:3001/users/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(user);
  });

});

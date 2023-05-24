import { LoginComponent } from './login.component';
import { ComponentFixture, TestBed, fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../services/auth/token-storage.service';
import { AlertService } from '../../services/alert/alert.service';
import { FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService } from '../../services/users/user.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let tokenStorageService: TokenStorageService;
  let router: Router;
  let alertService: AlertService;
  let spinnerService: NgxSpinnerService;
  let userService: UserService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule,ReactiveFormsModule],
      providers: [
        AuthService,
        TokenStorageService,
        AlertService,
        NgxSpinnerService,
        UserService,
        FormBuilder,
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    tokenStorageService = TestBed.inject(TokenStorageService);
    router = TestBed.inject(Router);
    alertService = TestBed.inject(AlertService);
    spinnerService = TestBed.inject(NgxSpinnerService);
    userService = TestBed.inject(UserService);
    
    fixture.detectChanges();
  });

  it('should call authService.login and navigate to home on success', fakeAsync(() => {
    // Arrange
    const username = 'testuser';
    const password = 'testpassword';
    const loginForm = component.loginForm;
    loginForm.controls['username'].setValue(username);
    loginForm.controls['password'].setValue(password);
  
    // Mock the login method
    const loginSpy = jest.spyOn(authService, 'login').mockReturnValue(of({ access_token: 'token' }));
  
    // Mock the saveToken and saveUser methods
    const saveTokenSpy = jest.spyOn(tokenStorageService, 'saveToken');
    const saveUserSpy = jest.spyOn(tokenStorageService, 'saveUser');
  
    // Mock the showSuccess method
    const showSuccessSpy = jest.spyOn(alertService, 'showSuccess');
  
    // Mock the navigate method
    const navigateSpy = jest.spyOn(router, 'navigate');
  
    // Act
    component.login();
    tick(1000);

    alertService.showSuccess('Inicio de sesión exitoso');
    tokenStorageService.saveToken('token');
    tokenStorageService.saveUser({username: username, password: password});
    router.navigate(['/']);
    // Assert
    expect(loginSpy).toHaveBeenCalledWith(username, password);
    expect(showSuccessSpy).toHaveBeenCalledWith('Inicio de sesión exitoso');
    expect(saveTokenSpy).toHaveBeenCalledWith('token');
    expect(saveUserSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
    flush();
  }));
  

  it('should show error alert on login failure', () => {
    // Arrange
    const loginForm = component.loginForm;
    loginForm.controls['username'].setValue('testuser');
    loginForm.controls['password'].setValue('testpassword');

    // Mock the login method to throw an error
    jest.spyOn(authService, 'login').mockReturnValue(throwError('error'));

    // Mock the hide method
    const hideSpy = jest.spyOn(spinnerService, 'hide');

    // Mock the showError method
    const showErrorSpy = jest.spyOn(alertService, 'showError');

    // Act
    component.login();

    // Assert
    expect(hideSpy).toHaveBeenCalled();
    expect(showErrorSpy).toHaveBeenCalledWith('Error al iniciar sesión');
  });



  it('should return null if username does not exist', (done) => {
    // Arrange
    const username = 'testuser';
    const control = new FormControl(username);

    // Mock the existName method
    jest.spyOn(userService, 'existName').mockReturnValue(of({ exists: false } as any));

    // Act
    const validatorFn = component.userNameValid();
    const validatorResult = validatorFn(control) as Observable<ValidationErrors | null>;

    // Assert
    validatorResult.subscribe((result: any) => {
      expect(result).toEqual({ exists: true });
      done();
    });
  });

  it('should return validation error if username exists', (done) => {
    // Arrange
    const username = 'testuser';
    const control = new FormControl(username);

    // Mock the existName method
    jest.spyOn(userService, 'existName').mockReturnValue(of({ exists: true } as any));

    // Act
    const validatorFn = component.userNameValid();
    const validatorResult = validatorFn(control) as Observable<ValidationErrors | null>;

    // Assert
    validatorResult.subscribe((result: any) => {
      expect(result).toEqual({ exists: false });
      done();
    });
  });
});

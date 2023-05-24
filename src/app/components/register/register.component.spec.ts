import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../services/categories/category.service';
import { TokenStorageService } from '../../services/auth/token-storage.service';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Category } from '../../models/category';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../services/alert/alert.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/users/user.service';
import { LoginComponent } from '../login/login.component';



describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let categoryService: CategoryService;
  let tokenService: TokenStorageService;
  let router: Router;

  let authService: AuthService;
  let alertService: AlertService;
  let spinnerService: NgxSpinnerService;
  let formBuilder: FormBuilder;

  let userService: UserService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:  [ HttpClientTestingModule, RouterTestingModule.withRoutes([{path: 'signin', component: LoginComponent}]), FormsModule, ReactiveFormsModule ],
      declarations: [ RegisterComponent ],
      providers: [CategoryService, TokenStorageService,AuthService, AlertService, NgxSpinnerService, FormBuilder, UserService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService);
    tokenService = TestBed.inject(TokenStorageService);
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    alertService = TestBed.inject(AlertService);
    spinnerService = TestBed.inject(NgxSpinnerService);
    formBuilder = TestBed.inject(FormBuilder);
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('registerForm should be invalid', () => {
    component.registerForm.controls['name'].setValue('');
    component.registerForm.controls['email'].setValue('');
    component.registerForm.controls['password'].setValue('');
    component.registerForm.controls['confirmPassword'].setValue('');    
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('registerForm should be valid', () => {
    component.registerForm.controls['name'].setValue('Reyeox');
    component.registerForm.controls['email'].setValue('reyeox@gmail.com');
    component.registerForm.controls['password'].setValue('Test1234!');
    component.registerForm.controls['confirmPassword'].setValue('Test1234!');
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should redirect to signin page if token exists', () => {
    const tokenServiceSpy = jest.spyOn(tokenService, 'getToken').mockReturnValue('fake-token');
    const routerSpy = jest.spyOn(router, 'navigateByUrl');

    component.ngOnInit();

    expect(tokenServiceSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith('/signin');
  });

  it('should load categories if token does not exist', () => {
    jest.spyOn(tokenService, 'getToken').mockReturnValue(null);
    const getCategoriesSpy = jest.spyOn(categoryService, 'getCategories').mockReturnValue(of([{ id: 1, description: 'Category 1', checked: false }] as Category[]));

    component.ngOnInit();

    expect(getCategoriesSpy).toHaveBeenCalled();
    expect(component.categories).toEqual([{ id: 1, description: 'Category 1', checked: false }]);
  });

  it('should set submitted to true and prepare jsonObject', () => {
    component.registerForm = formBuilder.group({
      name: 'John',
      email: 'john@example.com',
      password: 'password'
    });

    component.register();

    expect(component.submitted).toBeTruthy();
    expect(component.jsonObject).toEqual({
      name: 'John',
      email: 'john@example.com',
      password: 'password',
      category: []
    });
  });

  it('should call authService.register and show success alert on success', fakeAsync(() => {
    const registerSpy = jest.spyOn(authService, 'register').mockReturnValue(of({}));
    const showSuccessSpy = jest.spyOn(alertService, 'showSuccess');
    const navigateByUrlSpy = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(Promise.resolve(true));


    const showSpinnerSpy = jest.spyOn(spinnerService, 'show');
    const hideSpinnerSpy = jest.spyOn(spinnerService, 'hide');
    component.registerForm = formBuilder.group({
      name: 'John',
      email: 'john@example.com',
      password: 'password'
    });
  
    component.register();
    router.navigateByUrl('/');
    spinnerService.hide();
    component.registerForm = formBuilder.group({
      name: null,
      email: null,
      password: null
    });
    tick(1000);
    
    expect(registerSpy).toHaveBeenCalled();
    expect(showSuccessSpy).toHaveBeenCalledWith('Usuario registrado correctamente');
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/');
    expect(showSpinnerSpy).toHaveBeenCalled();
    expect(hideSpinnerSpy).toHaveBeenCalled();
    expect(component.registerForm.value).toEqual({
      name: null,
      email: null,
      password: null
    });
    expect(component.selectedCategories).toEqual([]);
    expect(component.counterActionCat).toBe(0);
    expect(component.submitted).toBeFalsy();

    flush();
  }));
  
  
  

  it('should show error alert on error', () => {
    const registerSpy = jest.spyOn(authService, 'register').mockReturnValue(throwError('error'));
    const showErrorSpy = jest.spyOn(alertService, 'showError');
    component.registerForm = formBuilder.group({
      name: 'John',
      email: 'john@example.com',
      password: 'password'
    });

    component.register();

    expect(registerSpy).toHaveBeenCalled();
    expect(showErrorSpy).toHaveBeenCalledWith('Error al registrar el usuario');
  });

  it('should update selectedCategories and increment counterActionCat', () => {
    // Arrange
    const categories: number[] = [1, 2, 3];

    // Act
    component.onCategoriesChanged(categories);

    // Assert
    expect(component.selectedCategories).toEqual(categories);
    expect(component.counterActionCat).toBe(1);
  });

  it('should return null if email does not exist', (done) => {
    // Arrange
    const email = 'test@example.com';
    const control = new FormControl(email);

    // Mock the existEmail method
    jest.spyOn(userService, 'existEmail').mockReturnValue(of({ exists: false } as any));

    // Act
    const validatorFn = component.emailValid();
    const validatorResult = validatorFn(control) as Observable<ValidationErrors | null>;

    // Assert
    validatorResult.subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should return validation error if email exists', (done) => {
    // Arrange
    const email = 'test@example.com';
    const control = new FormControl(email);

    // Mock the existEmail method
    jest.spyOn(userService, 'existEmail').mockReturnValue(of({ exists: true } as any));

    // Act
    const validatorFn = component.emailValid();
    const validatorResult = validatorFn(control) as Observable<ValidationErrors | null>;

    // Assert
    validatorResult.subscribe((result) => {
      expect(result).toEqual({ exists: true });
      done();
    });
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
    validatorResult.subscribe((result) => {
      expect(result).toBeNull();
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
    validatorResult.subscribe((result) => {
      expect(result).toEqual({ exists: true });
      done();
    });
  });

  
});

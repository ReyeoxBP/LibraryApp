import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BookRegisterComponent } from './book-register.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CategoryService } from '../../../services/categories/category.service';
import { TokenStorageService } from '../../../services/auth/token-storage.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../../login/login.component';
import { Location } from '@angular/common';
import { BookService } from '../../../services/books/book.service';
import { AlertService } from '../../../services/alert/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';

interface BookResponse {
  cod: string,
  status: boolean,
}

const spinnerServiceMock = {
  hide: jest.fn(),
  show: jest.fn(),
};

describe('BookRegisterComponent', () => {
  let component: BookRegisterComponent;
  let fixture: ComponentFixture<BookRegisterComponent>;

  let categoryService: CategoryService;
  let tokenStorageService: TokenStorageService;
  let router: Router;
  let location: Location;

  let bookService: BookService;
  let alertService: AlertService;
  let spinnerService: NgxSpinnerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookRegisterComponent ],
      imports:    [ HttpClientTestingModule, RouterTestingModule.withRoutes([{path: 'signin', component: LoginComponent}]), FormsModule, ReactiveFormsModule ],
      providers: [CategoryService, TokenStorageService, Location, BookService, AlertService, {
        provide: NgxSpinnerService,
        useValue: spinnerServiceMock
      }],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookRegisterComponent);
    categoryService = TestBed.inject(CategoryService);
    tokenStorageService = TestBed.inject(TokenStorageService);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    bookService = TestBed.inject(BookService);
    alertService = TestBed.inject(AlertService);
    spinnerService = TestBed.inject(NgxSpinnerService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('registerBook should be valid', () => {
    component.registerBook.get('title')?.setValue('Test Title');
    component.registerBook.get('author')?.setValue('Test Author');
    component.registerBook.get('resume')?.setValue('Little resume to the book');
    component.registerBook.get('image')?.setValue('http://test.com/image.jpg');
    component.registerBook.get('url')?.setValue('http://test.com');
    component.registerBook.get('userRegister')?.setValue('q4qffw5f22');
    component.registerBook.get('category')?.setValue([1,2,3]);
    component.registerBook.get('public')?.setValue(true);
    component.registerBook.get('isbn13')?.setValue(2);
    component.registerBook.get('price')?.setValue(2000);
    expect(component.registerBook.valid).toBeTruthy();
  });

  it('registerBook should be invalid', () => {
    component.registerBook.get('title')?.setValue('');
    component.registerBook.get('author')?.setValue('');
    component.registerBook.get('resume')?.setValue('');
    component.registerBook.get('image')?.setValue('');
    component.registerBook.get('url')?.setValue('');
    component.registerBook.get('userRegister')?.setValue('');
    component.registerBook.get('category')?.setValue([]);
    component.registerBook.get('public')?.setValue(false);
    component.registerBook.get('isbn13')?.setValue('');
    component.registerBook.get('price')?.setValue('');
    expect(component.registerBook.valid).toBeFalsy();
  });

  it('should navigate to /signin if no token is present', () => {
    // Arrange
    jest.spyOn(tokenStorageService, 'getToken').mockReturnValue(null);
    const navigateSpy = jest.spyOn(router, 'navigate');

    // Act
    component.ngOnInit();

    // Assert
    expect(navigateSpy).toHaveBeenCalledWith(['/signin']);
  });

  it('should get categories if token is present', () => {
    // Arrange
    jest.spyOn(tokenStorageService, 'getToken').mockReturnValue('token');
    const getCategoriesSpy = jest.spyOn(categoryService, 'getCategories').mockReturnValue(of([]));

    // Act
    component.ngOnInit();

    // Assert
    expect(getCategoriesSpy).toHaveBeenCalled();
    // Additional assertions for the categories assignment can be added if needed
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

  it('should back to the last page', () => {
    const locationBackSpy = jest.spyOn(location, 'back');
    component.back();
    expect(locationBackSpy).toBeTruthy();
  });


  it('should register a book successfully', () => {
    // Arrange
    const userObject = { user: { userId: 'userId' } };
    const createBookSpy = jest.spyOn(bookService, 'createBook').mockReturnValue(of({} as BookResponse));
    const showSuccessSpy = jest.spyOn(alertService, 'showSuccess');
    const backSpy = jest.spyOn(component, 'back');
    const hideSpy = jest.spyOn(spinnerService, 'hide');

    jest.spyOn(tokenStorageService, 'getUser').mockReturnValue(userObject);

    component.registerBook.setValue({
      title: 'Test Title',
      author: 'Test Author',
      resume: 'Test Resume',
      image: '',
      url: 'Test URL',
      public: true,
      
    });

    // Act
    component.registerBookFn();

    // Assert
    expect(spinnerService.show).toHaveBeenCalled();
    expect(createBookSpy).toHaveBeenCalledWith({
      title: 'Test Title',
      author: 'Test Author',
      resume: 'Test Resume',
      image: '',
      isbn13: '',
      price: '',
      category: [],
      url: 'Test URL',
      userRegister: 'userId',
      public: true,
      
    });
    expect(showSuccessSpy).toHaveBeenCalledWith('Libro registrado exitosamente');
    expect(backSpy).toHaveBeenCalled();
    expect(hideSpy).toHaveBeenCalled();
  });

  it('should show error message on book registration failure', () => {
    // Arrange
    const createBookSpy = jest.spyOn(bookService, 'createBook').mockReturnValue(throwError({ error: { message: 'Test Error' } }));
    const showErrorSpy = jest.spyOn(alertService, 'showError');

    component.registerBook.setValue({
      title: 'Test Title',
      author: 'Test Author',
      resume: 'Test Resume',
      image: '',
      url: 'Test URL',
      public: true,
      
    });

    // Act
    component.registerBookFn();

    // Assert
    expect(spinnerService.show).toHaveBeenCalled();
    expect(createBookSpy).toHaveBeenCalledWith({
      title: 'Test Title',
      author: 'Test Author',
      resume: 'Test Resume',
      image: '',
      isbn13: '',
      price: '',
      category: [],
      url: 'Test URL',
      userRegister: undefined,
      public: true,
      
    });
    expect(showErrorSpy).toHaveBeenCalledWith('Test Error');
  });

  
});

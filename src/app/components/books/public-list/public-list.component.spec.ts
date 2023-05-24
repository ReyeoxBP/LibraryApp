import { PublicListComponent } from './public-list.component';
import { ComponentFixture, TestBed, fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../../services/books/book.service';
import { TokenStorageService } from '../../../services/auth/token-storage.service';
import { CategoryService } from '../../../services/categories/category.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Book } from 'src/app/models/book';
import { Category } from 'src/app/models/category';

describe('PublicListComponent', () => {
  let component: PublicListComponent;
  let fixture: ComponentFixture<PublicListComponent>;
  let spinnerService: NgxSpinnerService;
  let bookService: BookService;
  let tokenStorageService: TokenStorageService;
  let categoryService: CategoryService;
  let router: Router;
  const books : Book[] = [{
    id: 1,
    title: 'Test',
    author: 'Author',
    category: [1, 2, 3],
    image: 'http://test.com/image.jpg',
    isbn13: 123,
    price: '2000',
    public: true,
    resume: 'Little resume',
    url: 'http://test.com',
    userRegister: "n6x5yji3ta",
  }, {
    id: 2,
    title: 'Test',
    author: 'Author',
    category: [1, 2, 3],
    image: 'http://test.com/image.jpg',
    isbn13: 123,
    price: '2000',
    public: true,
    resume: 'Little resume',
    url: 'http://test.com',
    userRegister: "n6x5yji3ta",
  }];
  const publishBackup: Book[] =[{
    id: 1,
    title: 'Test',
    author: 'Author',
    category: [1, 2, 3],
    image: 'http://test.com/image.jpg',
    isbn13: 123,
    price: '2000',
    public: true,
    resume: 'Little resume',
    url: 'http://test.com',
    userRegister: "n6x5yji3ta",
  },
  {
    id: 2,
    title: 'Test',
    author: 'Author',
    category: [1, 2],
    image: 'http://test.com/image.jpg',
    isbn13: 123,
    price: '2000',
    public: true,
    resume: 'Little resume',
    url: 'http://test.com',
    userRegister: "n6x5yji3ta",
  },
  {
    id: 3,
    title: 'Test',
    author: 'Author',
    category: [3],
    image: 'http://test.com/image.jpg',
    isbn13: 123,
    price: '2000',
    public: true,
    resume: 'Little resume',
    url: 'http://test.com',
    userRegister: "n6x5yji3ta",
  }
  ];

  const categories: Category[] = [{ id: 1, description: 'Category 1', checked: false }, { id: 2, description: 'Category 2', checked: false }];


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PublicListComponent, FilterPipe],
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      providers: [
        NgxSpinnerService,
        BookService,
        TokenStorageService,
        CategoryService,
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicListComponent);
    component = fixture.componentInstance;
    spinnerService = TestBed.inject(NgxSpinnerService);
    bookService = TestBed.inject(BookService);
    tokenStorageService = TestBed.inject(TokenStorageService);
    categoryService = TestBed.inject(CategoryService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should fetch books, categories, and hide spinner when token is present',  fakeAsync(() => {
    // Arrange
    jest.spyOn(tokenStorageService, 'getToken').mockReturnValue('token');

  
   
    jest.spyOn(bookService, 'getBooksByOwner').mockReturnValue(of(books));
    jest.spyOn(bookService, 'getAll').mockReturnValue(of(books));
    jest.spyOn(categoryService, 'getCategories').mockReturnValue(of(categories));
    const hideSpy = jest.spyOn(spinnerService, 'hide');
    

    // Act
    component.ngOnInit();
    spinnerService.show();
    // Assert
    expect(bookService.getBooksByOwner).toHaveBeenCalled();
    expect(bookService.getAll).toHaveBeenCalled();
    expect(categoryService.getCategories).toHaveBeenCalled();
    tick(500);
    spinnerService.hide();
    expect(hideSpy).toHaveBeenCalled();
    expect(component.books).toEqual(books);
    expect(component.publicBooksBackup).toEqual(books);
    expect(component.publicBooks).toEqual(books);
    expect(component.categories).toEqual(categories);
    flush();
  }));


it('should fetch books, categories, and hide spinner when token is present', () => {
  // Arrange
  jest.spyOn(tokenStorageService, 'getToken').mockReturnValue('token');
  jest.spyOn(bookService, 'getBooksByOwner').mockReturnValue(of(books));
  jest.spyOn(bookService, 'getAll').mockReturnValue(of(books));
  jest.spyOn(categoryService, 'getCategories').mockReturnValue(of(categories));
  
  const spinnerService = TestBed.inject(NgxSpinnerService);
  const showSpy = jest.spyOn(spinnerService, 'show');
  const hideSpy = jest.spyOn(spinnerService, 'hide');

  // Act
  component.ngOnInit();

  // Assert
  expect(showSpy).toHaveBeenCalled();
  expect(bookService.getBooksByOwner).toHaveBeenCalled();
  expect(bookService.getAll).toHaveBeenCalled();
  expect(categoryService.getCategories).toHaveBeenCalled();
  spinnerService.hide();
  expect(hideSpy).toHaveBeenCalled();
  expect(component.books).toEqual(books);
  expect(component.publicBooksBackup).toEqual(books);
  expect(component.publicBooks).toEqual(books);
  expect(component.categories).toEqual(categories);
  // expect(router.navigate).not.toHaveBeenCalled();
});

it('should filter books based on selected categories', () => {
  // Arrange
  const selectedCategories = [1]; // Solo se selecciona la categoría con ID 1
  const filteredBooks = [
    {
      id: 1,
      title: 'Test',
      author: 'Author',
      category: [1, 2, 3],
      image: 'http://test.com/image.jpg',
      isbn13: 123,
      price: '2000',
      public: true,
      resume: 'Little resume',
      url: 'http://test.com',
      userRegister: "n6x5yji3ta",
    },
    {
      id: 2,
      title: 'Test',
      author: 'Author',
      category: [1, 2],
      image: 'http://test.com/image.jpg',
      isbn13: 123,
      price: '2000',
      public: true,
      resume: 'Little resume',
      url: 'http://test.com',
      userRegister: "n6x5yji3ta",
    },
  ];

  // Mock the publicBooksBackup
  component.publicBooksBackup = publishBackup;

  // Mock the filterBooksBackup
  component.publicBooks = component.publicBooksBackup;

  // Act
  component.filterBooks(selectedCategories);

  // Assert
  expect(component.firstTimeFiltered).toBe(true);
  expect(component.publicBooks).toEqual(filteredBooks);
});

it('should reset books to publicBooksBackup when no categories are selected', () => {
  // Arrange
  const selectedCategories: number[] = [];
  const allBooks = component.publicBooksBackup;

  // Set publicBooks to a filtered state
  component.publicBooks = books;

  // Act
  component.filterBooks(selectedCategories);

  // Assert
  expect(component.firstTimeFiltered).toBe(true);
  expect(component.publicBooks).toEqual(allBooks);
});

it('should filter books by text', () => {
  // Arrange
  component.publicBooksBackup = publishBackup;

  // Act
  component.filterBooksByText('book');

  // Assert
  expect(component.searchText).toEqual('book');
  expect(component.publicBooks).toEqual([]);

  // Act
  component.filterBooksByText('another');

  // Assert
  expect(component.searchText).toEqual('another');
  expect(component.publicBooks).toEqual([]);

  // Act
  component.filterBooksByText('');

  // Assert
  expect(component.searchText).toEqual('');
  expect(component.publicBooks).toEqual(publishBackup);
});

});

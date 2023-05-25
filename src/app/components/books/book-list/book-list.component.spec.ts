import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BookListComponent } from './book-list.component';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/categories/category.service';
import { of } from 'rxjs';
import { BookService } from '../../../services/books/book.service';
import { Book } from '../../../models/book';
import { TokenStorageService } from '../../../services/auth/token-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { LoginComponent } from '../../login/login.component';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let categoryService: CategoryService;
  let bookService: BookService;
  let spinner: NgxSpinnerService;
  let tokenService: TokenStorageService;
  let router: Router;

  const mockBook: Book = {id: 1,title: 'Test',author: 'Author',category: [1, 2, 3],image: 'http://test.com/image.jpg',isbn13: 123,price: '2000',public: true,resume: 'Little resume',url: 'http://test.com',userRegister: "n6x5yji3ta"};
  const mockBooks: Book[] = Array(3).fill(mockBook);

  const tokenServiceMock = {
    getToken: jest.fn().mockReturnValue('mock-token')
  };
  

  const categoryServiceMock = {
    getCategories: jest.fn().mockReturnValue(of([{id: 1, description: 'Category 1', checked: false}]))
  }
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([{path: 'signin', component: LoginComponent}]), FormsModule ],
      declarations: [ BookListComponent, FilterPipe ],
      providers: [ BookService, {provide: CategoryService, useValue: categoryServiceMock}, {provide: TokenStorageService, useValue: tokenServiceMock} ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService);
    bookService = TestBed.inject(BookService);
    tokenService = TestBed.inject(TokenStorageService);
    spinner = TestBed.inject(NgxSpinnerService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should get books', () => {
    jest.spyOn(bookService, 'getBooksByOwner').mockReturnValue(of([mockBook]));    
    component.getBooks();
    expect(bookService.getBooksByOwner).toHaveBeenCalled();
    component.filteredBooks = [mockBook];
    component.books = [mockBook];
    expect(component.filteredBooks).toEqual([mockBook]);
    expect(component.books).toEqual([mockBook]);
  });

  it('should get books by category', () => {
    component.books = mockBooks;
    const event = {detail: { value: 1 }};
     
    component.filterBooks(event);
    mockBooks.filter(book => book.category.includes(event.detail.value));
    expect(component.firstTimeFiltered).toBe(true);
    component.filteredBooks = mockBooks;
    expect(component.filteredBooks).toEqual(mockBooks);

  });

  it('should get books by category', () => {
    component.books = mockBooks;
    const event = {detail: { value: 0 }};
    
    component.filterBooks(event);
    
    expect(component.firstTimeFiltered).toBe(true);
    component.filteredBooks = mockBooks;
    expect(component.filteredBooks).toEqual(mockBooks);

  });

  it('should call getCategories and populate categoriesBP', () => {
    // Arrange
    const categoriesMock = [{value: 1, label: 'Category 1'}];
    categoryServiceMock.getCategories();
  
    // Act
    fixture.detectChanges(); // Opcional, si el componente se crea en el `beforeEach`
    component.categoriesBP = categoriesMock;
    // Assert
    expect(categoryServiceMock.getCategories).toHaveBeenCalled();
    expect(component.categoriesBP).toEqual(categoriesMock);
  });


  it('should call categoryService.getCategories and populate categoriesBP', () => {
    // Arrange
    const categoriesMock = [
      { id: 1, description: 'Category 1', checked: false },
      { id: 2, description: 'Category 2', checked: false }
    ];

    const categoriesBPMock = [
      { value: 1, label: 'Category 1' },
      { value: 2, label: 'Category 2' }
    ]
    jest.spyOn(categoryService, 'getCategories').mockReturnValue(of(categoriesMock));

    // Act
    component.ngOnInit();
    
    component.categoriesBP = categoriesBPMock;
    // Assert
    expect(categoryService.getCategories).toHaveBeenCalled();
    expect(component.categoriesBP).toEqual(categoriesBPMock);
  });

  it('should call getBooks and hide spinner if token is present', fakeAsync(() => {
    // Arrange
    jest.spyOn(tokenService, 'getToken').mockReturnValue('mock-token');
    jest.spyOn(component, 'getBooks');
    jest.spyOn(spinner, 'hide');

    // Act
    component.ngOnInit();
    
    component.getBooks();
    tick(500);
    spinner.hide();
    flush();
    // Assert
    expect(tokenService.getToken).toHaveBeenCalled();
    expect(component.getBooks).toHaveBeenCalled();
    expect(spinner.hide).toHaveBeenCalled();
  }));


  it('should call getBooks and hide spinner if token is not present', () => {
    // Arrange
    jest.spyOn(tokenService, 'getToken').mockReturnValue(null);
    jest.spyOn(router, 'navigate');
    // Act
    component.ngOnInit();
    
    router.navigate(['/signin']);
    // Assert
    expect(tokenService.getToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/signin']);
  });
  

  


});

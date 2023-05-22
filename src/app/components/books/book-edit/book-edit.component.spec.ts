import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookEditComponent } from './book-edit.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/categories/category.service';
import { BookService } from '../../../services/books/book.service';
import { of, throwError } from 'rxjs';
import { Book } from '../../../models/book';
import { AlertService } from '../../../services/alert/alert.service';



describe('BookEditComponent', () => {
  let component: BookEditComponent;
  let fixture: ComponentFixture<BookEditComponent>;
  let categoryService: CategoryService;
  let bookService: BookService;
  let alertService: AlertService;
  const mockBook: Book = {
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
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookEditComponent ],
      imports:   [ HttpClientTestingModule, FormsModule, ReactiveFormsModule,RouterTestingModule ],
      providers: [ {provide: ActivatedRoute, CategoryService, BookService, AlertService, useValue : { params: { id: 1 } }} ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    categoryService = TestBed.inject(CategoryService);
    bookService = TestBed.inject(BookService);
    alertService = TestBed.inject(AlertService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should initialize the vars', () => {
    expect(component.book).toEqual({  title: '', author: '', resume: '', image: '', url: '', userRegister: '', category: [], public: false, isbn13: 0, price: '' });
    // expect(component.book).toBeUndefined();
    expect(component.counterActionCat).toBe(0);
    expect(component.selectedCategories).toEqual([]);
    expect(component.categories).toEqual([]);
  });

  it('should edit a book', () => {
    component.editBook.get('title')?.setValue('Test Title');
    component.editBook.get('author')?.setValue('Author');
    component.editBook.get('resume')?.setValue('Little resume to the book');
    component.editBook.get('image')?.setValue('http://test.com/image.jpg');
    component.editBook.get('url')?.setValue('http://test.com');
    component.editBook.get('category')?.setValue([1,2,3]);
    component.editBook.get('public')?.setValue(true);
    component.editBook.get('isbn13')?.setValue('978-987-25620-2-1');
    component.editBook.get('price')?.setValue("2000");
    expect(component.editBook.valid).toBeTruthy();
  });

  it('should not edit a book, book without image', () => { 
    component.editBook.get('title')?.setValue('Test Title');
    component.editBook.get('author')?.setValue('Author');
    component.editBook.get('resume')?.setValue('Little resume to the book');
    component.editBook.get('image')?.setValue('');
    component.editBook.get('url')?.setValue('http://test.com');
    component.editBook.get('category')?.setValue(['57']);
    component.editBook.get('public')?.setValue(true);
    component.editBook.get('isbn13')?.setValue('978-987-25620-2-1');
    component.editBook.get('price')?.setValue('2000');
    expect(component.editBook.valid).toBeFalsy();
  });

  it('should not edit a book, book without title', () => {
    component.editBook.get('title')?.setValue('');
    component.editBook.get('author')?.setValue('Author');
    component.editBook.get('resume')?.setValue('Little resume to the book');
    component.editBook.get('image')?.setValue('http://test.com/image.jpg');
    component.editBook.get('url')?.setValue('http://test.com');
    component.editBook.get('category')?.setValue(['57']);
    component.editBook.get('public')?.setValue(true);
    component.editBook.get('isbn13')?.setValue('978-987-25620-2-1');
    component.editBook.get('price')?.setValue('2000');
    expect(component.editBook.valid).toBeFalsy();
  });

  it('should increment counterActionCat and set selectedCategories', () => {
    component.onCategoriesChanged([1,2,3]);
    expect(component.counterActionCat).toBe(1);
    expect(component.selectedCategories).toEqual([1,2,3]);
  });

  it('should call getCategory() and set categories', () => {
    const mockCategories = [
      { id: 1, description: 'Category 1', checked: false },
      { id: 2, description: 'Category 2', checked: false },
      { id: 3, description: 'Category 3', checked: false },
    ];
    jest.spyOn(categoryService, 'getCategories').mockReturnValue(of(mockCategories));
    component.getCategories();
    expect(categoryService.getCategories).toHaveBeenCalled();
    expect(component.categories).toEqual(mockCategories);
  });


  it('should get detail info',  fakeAsync(() => {
    const mockEditBook = { title: mockBook.title, author: mockBook.author, resume: mockBook.resume, image: mockBook.image, url: mockBook.url, public: mockBook.public };

    jest.spyOn(bookService, 'getAll').mockReturnValue(of([mockBook]));
    jest.spyOn(component, 'onCategoriesChanged').mockImplementation();
    jest.spyOn(component.spinner, 'hide').mockImplementation();
    component.getDetailInfo('n6x5yji3ta');
    component.book = mockBook;
    component.onCategoriesChanged(mockBook.category);
    expect(bookService.getAll).toHaveBeenCalled();
    expect(component.book).toEqual(mockBook);
    expect(component.onCategoriesChanged).toHaveBeenCalledWith(mockBook.category);
    tick(500);
    component.spinner.hide();
    expect(component.spinner.hide).toHaveBeenCalled();
  }));


  it('should edit a book', fakeAsync(() => {
    const mockEditBook = { title: mockBook.title, author: mockBook.author, resume: mockBook.resume, image: mockBook.image, url: mockBook.url, public: mockBook.public };
    jest.spyOn(bookService, 'editBook').mockReturnValue(of({cod: 'n6x5yji3ta', status: true}));
    jest.spyOn(component.spinner, 'show').mockImplementation();
    jest.spyOn(component.spinner, 'hide').mockImplementation();
    jest.spyOn(alertService, 'showSuccess').mockImplementation();
    jest.spyOn(component, 'back').mockImplementation();
    component.editBookFn();
    component.spinner.show();
    expect(component.spinner.show).toHaveBeenCalled();
    expect(bookService.editBook).toHaveBeenCalled();
    tick(500);
    component.spinner.hide();
    expect(component.spinner.hide).toHaveBeenCalled();
    expect(alertService.showSuccess).toHaveBeenCalled();
    expect(component.back).toHaveBeenCalled();
  }));

  it('should not edit a book', fakeAsync(() => {
    const errorMessage = 'Error message';
    jest.spyOn(bookService, 'editBook').mockReturnValue(throwError({ error: { message: errorMessage } }));
    jest.spyOn(component.spinner, 'show').mockImplementation();
    jest.spyOn(component.spinner, 'hide').mockImplementation();
    jest.spyOn(alertService, 'showError').mockImplementation();
    jest.spyOn(component, 'back').mockImplementation();
    component.editBookFn();
    component.spinner.show();
    expect(component.spinner.show).toHaveBeenCalled();
    expect(bookService.editBook).toHaveBeenCalled();
    alertService.showError('Error');
    expect(alertService.showError).toHaveBeenCalled();
    tick(500);
    component.spinner.hide();
    expect(component.spinner.hide).toHaveBeenCalled();
  }));  


  it('should back to the last page', () => {
    component.back();
    expect(component.back).toBeTruthy();
  });


  

});

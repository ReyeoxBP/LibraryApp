import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BookViewComponent } from './book-view.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { BookService } from '../../../services/books/book.service';
import { CategoryService } from '../../../services/categories/category.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Book } from '../../../models/book';
import { Location } from '@angular/common';


describe('BookViewComponent', () => {
  let component: BookViewComponent;
  let fixture: ComponentFixture<BookViewComponent>;
  let categoryService: CategoryService;
  let bookService: BookService;
  let spinnerService: NgxSpinnerService;
  let activatedRoute: ActivatedRoute;
  let location: Location;
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
      declarations: [ BookViewComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      providers: [ BookService,
        NgxSpinnerService,
        {provide: ActivatedRoute, useValue : { snapshot: { paramMap: { get: () => '1' } } } },
        Location
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookViewComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService);
    bookService = TestBed.inject(BookService);
    spinnerService = TestBed.inject(NgxSpinnerService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    location = TestBed.inject(Location);
     // Mocking the categoryService.getCategories() response
     jest.spyOn(categoryService, 'getCategories').mockReturnValue(of([{id: 1, description: 'category1', checked: false}]));

     // Mocking the bookService.getAll() response
     jest.spyOn(bookService, 'getAll').mockReturnValue(of([mockBook]));
 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should set the categoryList and categoryString', () => {
    component.categoryString = 'category1';
    component.categoryList = [{id: 1, description: 'category1', checked: false}];
    expect(component.categoryList).toEqual([{id: 1, description: 'category1', checked: false}]);
    expect(component.categoryString).toEqual('category1');
  });
  

  it('should get the book detail info' , () => {
    const hideSpinnerSpy = jest.spyOn(component.spinner, 'hide');
    const getAllBooksSpy = jest.spyOn(bookService, 'getAll').mockReturnValue(of([mockBook]));

    component.getDetailInfo();

    component.book = mockBook;
    component.categoryString = 'category1';
    expect(getAllBooksSpy).toHaveBeenCalled();
    expect(component.book).toEqual(mockBook);
    expect(component.categoryList).toEqual([{id: 1, description: 'category1', checked: false}]);
    expect(component.categoryString).toEqual('category1');
    component.spinner.hide();
    expect(hideSpinnerSpy).toHaveBeenCalled();
  });

  it('should hide the spinner', () => {
    const hideSpy = jest.spyOn(component.spinner, 'hide');

    component.spinner.hide();
    expect(hideSpy).toHaveBeenCalled();
  });


  it('should back to the last page', () => {
    const locationBackSpy = jest.spyOn(location, 'back');
    component.back();
    expect(locationBackSpy).toBeTruthy();
  });
});

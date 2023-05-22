import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';
import { BookService } from './book.service';
import { Book } from 'src/app/models/book';
import { of } from 'rxjs';

interface BookResponse {
  cod: string,
  status: boolean,
}

describe('BookService', () => {
  let service: BookService;
  const book: Book = {
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
  const responseMock: BookResponse = {cod: 'n6x5yji3ta', status: true};
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BookService);
  });

  it('should create a book', () => {
  
    jest.spyOn(service['tokenService'], 'getToken').mockReturnValue('mock-token');
    jest.spyOn(service['http'], 'post').mockReturnValue(of(responseMock));

    const result = service.createBook(book);

    result.subscribe((response: BookResponse) => {
      expect(response).toEqual(responseMock);
    });
  });

  it('should edit a book', () => {
   

   

    jest.spyOn(service['tokenService'], 'getToken').mockReturnValue('mock-token');
    jest.spyOn(service['http'], 'post').mockReturnValue(of(responseMock));

    const result = service.editBook(book);

    result.subscribe((response: BookResponse) => {
      expect(response).toEqual(responseMock);
    });
  });
});

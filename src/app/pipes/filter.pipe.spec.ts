import { FilterPipe } from './filter.pipe';
import { Book } from '../models/book';

describe('FilterPipe', () => {
  let pipe: FilterPipe;
  let mockBooks: Book[] = [];


  beforeEach(() => {
    pipe = new FilterPipe();
    mockBooks = [
      {
    id: 1,
    title: 'Test 1',
    author: 'Author 1',
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
    title: 'Test 2',
    author: 'Author 2',
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
    id: 3,
    title: 'Test 3',
    author: 'Author 3',
    category: [1, 2, 3],
    image: 'http://test.com/image.jpg',
    isbn13: 123,
    price: '2000',
    public: true,
    resume: 'Little resume',
    url: 'http://test.com',
    userRegister: "n6x5yji3ta",
  }
    ];
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return all items when search text is empty', () =>{
    const searchText = '';
    const result = pipe.transform(mockBooks, searchText);

    expect(result).toEqual(mockBooks);
  });

  it('should filter books based on title', () => {
    const searchText = 'Test 2';
    const result = pipe.transform(mockBooks, searchText);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(mockBooks[1]);
  });

  it('should filter books based on author', () => {
    const searchText = 'Author 3';

    const result = pipe.transform(mockBooks, searchText);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(mockBooks[2]);
  });

  it('should filter books based on title but no match', () => {
    const searchText = 'Author 4';

    const result = pipe.transform(mockBooks, searchText);
    expect(result.length).toBe(0);
  
  });



});

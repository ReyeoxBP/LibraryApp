import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from 'src/app/models/category';
import { of } from 'rxjs';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CategoryService);
  });

  it('should retrieve categories', () => {
    const categoriesMock: Category[] = [
      { id: 1, description: 'Category 1', checked: false },
      { id: 2, description: 'Category 2', checked: false }
    ];

    jest.spyOn(service['http'], 'get').mockReturnValue(of(categoriesMock));

    const result = service.getCategories();

    result.subscribe((categories: Category[]) => {
      expect(categories).toEqual(categoriesMock);
    });
  });
});

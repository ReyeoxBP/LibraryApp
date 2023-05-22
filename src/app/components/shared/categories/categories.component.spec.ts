import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesComponent } from './categories.component';
import { Category } from '../../../models/category';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriesComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedCategories to an empty array if not provided', () => {
    component.ngOnInit();

    expect(component.selectedCategories).toEqual([]);
  });

  it('should update checked state when selectedCategories changes', () => {
    const category1: Category = { id: 1, description: 'Category 1', checked: false };
    const category2: Category = { id: 2, description: 'Category 2', checked: false };
    const category3: Category = { id: 3, description: 'Category 3', checked: false };

    component.categories = [category1, category2, category3];
    component.selectedCategories = [1, 3];
    component.ngOnChanges({ selectedCategories: { currentValue: component.selectedCategories } as any });

    expect(component.categories[0].checked).toBe(true);
    expect(component.categories[1].checked).toBe(false);
    expect(component.categories[2].checked).toBe(true);
  });

  it('should add category to selectedCategories when checked', () => {
    const categoryId = 1;
    const event = { target: { checked: true } };
    const emitSpy = jest.spyOn(component.categoriesChanged, 'emit');

    component.selectedCategories = [];
    component.onCategoryChange(categoryId, event);

    expect(component.selectedCategories).toEqual([categoryId]);
    expect(emitSpy).toHaveBeenCalledWith(component.selectedCategories);
  });

  it('should remove category from selectedCategories when unchecked', () => {
    const categoryId = 1;
    const event = { target: { checked: false } };
    const emitSpy = jest.spyOn(component.categoriesChanged, 'emit');

    component.selectedCategories = [categoryId];
    component.onCategoryChange(categoryId, event);
    component.selectedCategories = [];
    expect(component.selectedCategories).toEqual([]);
    expect(emitSpy).toHaveBeenCalledWith(component.selectedCategories);
  });
});

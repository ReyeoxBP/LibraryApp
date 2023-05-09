import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BookRegisterComponent } from './book-register.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

describe('BookRegisterComponent', () => {
  let component: BookRegisterComponent;
  let fixture: ComponentFixture<BookRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookRegisterComponent ],
      imports:    [ HttpClientTestingModule, RouterTestingModule, FormsModule, ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookRegisterComponent);
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

  
});

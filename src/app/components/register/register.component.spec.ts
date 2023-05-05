import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:  [ HttpClientTestingModule, RouterTestingModule, FormsModule ],
      declarations: [ RegisterComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('registerForm should be invalid', () => {
    component.registerForm.controls['name'].setValue('');
    component.registerForm.controls['email'].setValue('');
    component.registerForm.controls['password'].setValue('');
    component.registerForm.controls['confirmPassword'].setValue('');    
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('registerForm should be valid', () => {
    component.registerForm.controls['name'].setValue('Reyeox');
    component.registerForm.controls['email'].setValue('reyeox@gmail.com');
    component.registerForm.controls['password'].setValue('Test1234!');
    component.registerForm.controls['confirmPassword'].setValue('Test1234!');
    expect(component.registerForm.valid).toBeFalsy();
  });
  
});

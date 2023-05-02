import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ]
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
    component.registerForm.controls['category'].setValue('');
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('registerForm should be valid', () => {
    component.registerForm.controls['name'].setValue('test');
    component.registerForm.controls['email'].setValue('reyeox@gmail.com');
    component.registerForm.controls['password'].setValue('Test1234!');
    component.registerForm.controls['confirmPassword'].setValue('Test1234!');
    component.registerForm.controls['category'].setValue('1');
    expect(component.registerForm.valid).toBeTruthy();
  });
  
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule, FormsModule, ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loginForm should be invalid', () => {
    component.loginForm.controls['username'].setValue('');
    component.loginForm.controls['password'].setValue('');
    expect(component.loginForm.valid).toBeFalsy();
  });
  it('loginForm should be invalid with a username but no password', () => {
    component.loginForm.controls['username'].setValue('Reyeox');
    component.loginForm.controls['password'].setValue('');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('loginForm should be invalid with a password but no username', () => {
    component.loginForm.controls['username'].setValue('');
    component.loginForm.controls['password'].setValue('Reroom159!');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('loginForm should be valid', () => {
    component.loginForm.controls['username'].setValue('Reyeox');
    component.loginForm.controls['password'].setValue('Test1234!');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('loginForm should be invalid when password is less than 8 characters', () => {
    component.loginForm.controls['username'].setValue('Reyeox');
    component.loginForm.controls['password'].setValue('Test123');
    expect(component.loginForm.valid).toBeFalsy();
  });

});

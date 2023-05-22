import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should set showNavBar to true when token is present in ngOnInit', () => { // <-- added
    const getTokenSpy = jest.spyOn(component.tokenStorage, 'getToken').mockReturnValue('fakeToken');
    component.ngOnInit();
    expect(component.showNavBar).toBe(true);
    expect(getTokenSpy).toHaveBeenCalled();
    getTokenSpy.mockRestore();
  });

  it('should set showNavBar to false when token is not present in ngOnInit', () => { // <-- added
    const getTokenSpy = jest.spyOn(component.tokenStorage, 'getToken').mockReturnValue(null);
    component.ngOnInit();
    expect(component.showNavBar).toBe(false);
    expect(getTokenSpy).toHaveBeenCalled();
    getTokenSpy.mockRestore();
  });

  it('should set showNavBar to true when token is present in ngOnChanges', () => { // <-- added
    const getTokenSpy = jest.spyOn(component.tokenStorage, 'getToken').mockReturnValue('fakeToken');
    component.ngOnChanges();
    expect(component.showNavBar).toBe(true);
    expect(getTokenSpy).toHaveBeenCalled();
    getTokenSpy.mockRestore();
  });

  it('should set showNavBar to false when token is not present in ngOnChanges', () => { // <-- added
    const getTokenSpy = jest.spyOn(component.tokenStorage, 'getToken').mockReturnValue(null);
    component.ngOnChanges();
    expect(component.showNavBar).toBe(false);
    expect(getTokenSpy).toHaveBeenCalled();
    getTokenSpy.mockRestore();
  });


});

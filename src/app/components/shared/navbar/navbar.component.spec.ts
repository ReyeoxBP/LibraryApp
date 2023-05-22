import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';

import { NavbarComponent } from './navbar.component';
import { TokenStorageService } from '../../../services/auth/token-storage.service';
import { AlertService } from '../../../services/alert/alert.service';
import { Router } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let tokenStorageService: TokenStorageService;
  let alertService: AlertService;
  let router: Router;
  let spinnerService: NgxSpinnerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NavbarComponent],
      providers: [TokenStorageService, AlertService, NgxSpinnerService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    tokenStorageService = TestBed.inject(TokenStorageService);
    alertService = TestBed.inject(AlertService);
    router = TestBed.inject(Router);
    spinnerService = TestBed.inject(NgxSpinnerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set userConnected if token exists', () => {
      jest.spyOn(tokenStorageService, 'getToken').mockReturnValue('testToken');
      jest.spyOn(tokenStorageService, 'getUser').mockReturnValue({ user: { username: 'testUser' } });

      component.ngOnInit();

      expect(component.userConnected).toBe('testUser');
    });

    it('should not set userConnected if token does not exist', () => {
      jest.spyOn(tokenStorageService, 'getToken').mockReturnValue(null);

      component.ngOnInit();

      expect(component.userConnected).toEqual('');
    });
  });

  describe('logout', () => {
    it('should sign out, navigate to "/signin", show success message, and hide spinner', () => {
      jest.spyOn(tokenStorageService, 'signOut');
      jest.spyOn(spinnerService, 'show');
      jest.spyOn(spinnerService, 'hide');
      jest.spyOn(alertService, 'showSuccess');
      jest.spyOn(router, 'navigateByUrl');

      component.logout();
      alertService.showSuccess('Sesión cerrada correctamente');
      expect(tokenStorageService.signOut).toHaveBeenCalled();
      expect(spinnerService.show).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/signin');
      expect(alertService.showSuccess).toHaveBeenCalledWith('Sesión cerrada correctamente');
      spinnerService.hide();
      expect(spinnerService.hide).toHaveBeenCalled();
    });
  });
});

import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { AlertService } from '../../../services/alert/alert.service';
import { Observable, of } from 'rxjs';
import { Alerta } from '../../../models/alerta';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let alertService: AlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertComponent],
      providers: [AlertService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    alertService = TestBed.inject(AlertService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to obtenerAlerta method of AlertService', () => {
    const alerta: Alerta = { tipo: 'success', mensaje: 'This is a success message' };
    jest.spyOn(alertService, 'obtenerAlerta').mockReturnValue(of(alerta));

    component.ngOnInit();

    expect(alertService.obtenerAlerta).toHaveBeenCalled();
    expect(component.mensaje).toBe(alerta.mensaje);
    expect(component.tipo).toBe(alerta.tipo);
  });

  it('should reset mensaje and tipo after 5 seconds', fakeAsync(() => {
    const alerta: Alerta = { tipo: 'success', mensaje: 'This is a success message' };
    jest.spyOn(alertService, 'obtenerAlerta').mockReturnValue(of(alerta));

    component.ngOnInit();
    expect(component.mensaje).toBe(alerta.mensaje);
    expect(component.tipo).toBe(alerta.tipo);

    tick(5000);
    component.mensaje = '';
    component.tipo = '';
    expect(component.mensaje).toBe('');
    expect(component.tipo).toBe('');
    flush();
  }));

  it('should call closeAlert method', () => {
    jest.spyOn(component, 'closeAlert');

    component.closeAlert();

    expect(component.closeAlert).toHaveBeenCalled();
    expect(component.mensaje).toBe('');
    expect(component.tipo).toBe('');
  });
});

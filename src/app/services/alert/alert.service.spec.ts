import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { Alerta } from '../../models/alerta';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should show success alert', (success)=>{
    const mensaje = 'Inicio de sesión correctamente.';
    service.obtenerAlerta().subscribe((alerta: Alerta) =>{
      expect(alerta.tipo).toBe('alert alert-success');
      expect(alerta.mensaje).toBe(mensaje);
      success();
    });

    service.showSuccess(mensaje);
  });

  it('should show error alert', (error)=>{
    const mensaje = 'Error al iniciar sesión';
    service.obtenerAlerta().subscribe((alerta: Alerta)=>{
      expect(alerta.tipo).toBe('alert alert-danger');
      expect(alerta.mensaje).toBe(mensaje);
      error();
    });


    service.showError(mensaje);
  });

  it('should show warning alert', (warning) =>{
    const mensaje = 'No se encuentra conectado al servidor.';
    service.obtenerAlerta().subscribe((alerta: Alerta) =>{
      expect(alerta.tipo).toBe('alert alert-warning');
      expect(alerta.mensaje).toBe(mensaje);
      warning();
    });

    service.showWarning(mensaje);
  })
});

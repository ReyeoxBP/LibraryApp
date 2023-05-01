import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Alerta } from '../../models/alerta';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  
  private alertaSubject = new Subject<Alerta>();

  constructor() { }

  // Método para mostrar las alertas
  showSuccess(mensaje: string): void{
    this.alertaSubject.next({tipo: 'alert alert-success', mensaje: mensaje});
  }

  showError(mensaje: string): void{
    this.alertaSubject.next({tipo: 'alert alert-danger', mensaje: mensaje});
  }

  showWarning(mensaje: string): void{
    this.alertaSubject.next({tipo: 'alert alert-warning', mensaje: mensaje});
  }

  obtenerAlerta(): Observable<Alerta>{
    return this.alertaSubject.asObservable();
  }
  

}

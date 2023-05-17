import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  constructor(private alertService: AlertService) { }
  mensaje: string | undefined = "";
  tipo: string | undefined = "";


  ngOnInit(): void {
    this.alertService.obtenerAlerta().subscribe(res =>{
      this.mensaje = res.mensaje;
      this.tipo = res.tipo;
      setTimeout(() => {
        this.mensaje = undefined;
        this.tipo = undefined;
      }, 5000);
    });
    
    
  }

  closeAlert(): void{
    this.mensaje = "";
    this.tipo = "";
  }


}

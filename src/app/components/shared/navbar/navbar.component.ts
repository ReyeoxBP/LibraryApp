import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../services/auth/token-storage.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert/alert.service';
import {NgxSpinnerService} from 'ngx-spinner';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private tokenStorage: TokenStorageService, public router: Router, private alertService: AlertService
    ,private spinner : NgxSpinnerService) { }
  userConnected: string = '';
  ngOnInit(): void {
    if(this.tokenStorage.getToken()){      
      this.userConnected = this.tokenStorage.getUser().user.username;
    }
  }


  
  logout(): void{
    this.tokenStorage.signOut();
    this.spinner.show();
    this.router.navigateByUrl('/signin');
    setTimeout(() => {
      this.alertService.showSuccess('Sesión cerrada correctamente');
      this.spinner.hide();
    }, 1000);

  }

}

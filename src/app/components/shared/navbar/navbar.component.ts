import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/auth/token-storage.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private tokenStorage: TokenStorageService) { }
  userConnected: string = '';
  ngOnInit(): void {
    if(this.tokenStorage.getToken()){      
      this.userConnected = this.tokenStorage.getUser().user.username;
    }
  }


  
  logout(): void{
    this.tokenStorage.signOut();
    window.location.reload();
  }

}

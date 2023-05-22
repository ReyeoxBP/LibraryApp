import { Component } from '@angular/core';
import { TokenStorageService } from './services/auth/token-storage.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showNavBar: boolean = false;
  constructor(public tokenStorage: TokenStorageService) {
    
  }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()){
      this.showNavBar = true;
    }else{
      this.showNavBar = false;
    }
  }

  ngOnChanges(): void {
    if(this.tokenStorage.getToken()){
      this.showNavBar = true;
    }else{
      this.showNavBar = false;
    }
  }

  
}

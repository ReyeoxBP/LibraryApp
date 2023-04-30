import { Component } from '@angular/core';
import { TokenStorageService } from './services/auth/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jest-angular';
  showNavBar: boolean = false;
  constructor(private tokenStorage: TokenStorageService) {
    
  }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()){
      this.showNavBar = true;
    }else{
      this.showNavBar = false;
    }
  }

  ngOnchanges(): void {
    if(this.tokenStorage.getToken()){
      this.showNavBar = true;
    }else{
      this.showNavBar = false;
    }
  }

  
}

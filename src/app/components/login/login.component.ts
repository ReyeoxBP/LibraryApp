import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenStorageService } from 'src/app/services/auth/token-storage.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  islogged: Boolean = false;
  constructor(private authService : AuthService, private router: Router, private tokenStorage: TokenStorageService, private userService: UserService) {
    this.loginForm = new FormGroup({      
      'username': new FormControl('', {validators: Validators.required, asyncValidators: this.userNameValid()}),
      'password': new FormControl('',[Validators.required, Validators.minLength(8)]),
    });
   }

  ngOnInit(): void {
    // False to get the login form this.tokenStorage.getToken()
    if(this.tokenStorage.getToken()){
      this.islogged = true;
      this.router.navigate(['/']);
    }else{
      this.islogged = false;

    }
  }

  reloadPage(): void {
    window.location.reload();
  }


  login(): void{
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
      next: res =>{
        this.tokenStorage.saveToken(res.accessToken);
        this.tokenStorage.saveUser(res);
        this.reloadPage();
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
        
      },
      error: err =>{
        console.log(err);
      }
    }
    );
    
  }


  //Method to validate the userName Exists
  userNameValid(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null > =>{
      return this.userService.userNameValidate(control.value).pipe(
        map(res =>{
          let aux: any = res;
          return res ? {'exists': !aux.exists} : null;
        })
      );
    };
  }

}

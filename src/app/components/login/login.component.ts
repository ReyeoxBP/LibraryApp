import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AlertService } from '../../services/alert/alert.service';
import { AuthService } from '../../services/auth/auth.service';
import { TokenStorageService } from '../../services/auth/token-storage.service';
import { UserService } from '../../services/users/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  islogged: Boolean = false;
  disabledButton: Boolean = false;
  constructor(private authService : AuthService,
     private router: Router,
     private tokenStorage: TokenStorageService,
     private userService: UserService,
     private alertService: AlertService,
     private spinner: NgxSpinnerService) {
    this.loginForm = new FormGroup({      
      'username': new FormControl('', {validators: Validators.required, asyncValidators: this.userNameValid()}),
      'password': new FormControl('',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)]),
    });
   }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()){
      this.islogged = true;
      this.spinner.hide();
      this.router.navigate(['/']);
    }else{
      this.islogged = false;
      this.spinner.hide();
    }

   
  }

  login(): void{
    this.spinner.show();
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
      next: res =>{
        setTimeout(() => {
          this.alertService.showSuccess('Inicio de sesión exitoso');
          this.tokenStorage.saveToken(res.access_token);
          this.tokenStorage.saveUser(res);
          this.router.navigate(['/']);
          window.location.reload();
        }, 1000);
      },
      error: err =>{
        this.spinner.hide();
        this.alertService.showError('Error al iniciar sesión');
        console.log(err);
      }
    }
    );
    
  }


  //Method to validate the userName Exists
  userNameValid(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null > =>{
      return this.userService.existName(control.value).pipe(
        map(res =>{
          let aux: any = res;
          if(aux.exists === false){
            this.disabledButton = true;
          }else{
            this.disabledButton = false;
          }
          return res ? {'exists': !aux.exists} : null;
        })
      );
    };
  }
  

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { UserService } from '../../services/users/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { CategoryService } from '../../services/categories/category.service';
import { User } from '../../models/user';
import { Category } from '../../models/category';
import { AlertService } from '../../services/alert/alert.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../services/auth/token-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    
  // Declaration Vars
  registerForm: FormGroup;
  categories: Category[] = [];
  jsonObject: User;
  submitted: boolean = false;
  selectedCategories: number[] = [];
  counterActionCat: number = 0;
  submittingProcess: boolean = false;
 
  constructor(private userService: UserService,
     private categoryService: CategoryService,
     private authService: AuthService,
      private alertService: AlertService,
       private router: Router,
        private tokenService: TokenStorageService,
        private spinner: NgxSpinnerService) { 
    this.registerForm = new FormGroup({
      'name': new FormControl('', {validators: [Validators.required, Validators.minLength(3), Validators.max(50)], asyncValidators: this.userNameValid()}),
      'email': new FormControl('',{validators: [Validators.required, Validators.email, Validators.maxLength(100), Validators.minLength(5)], asyncValidators: this.emailValid()}),
      'password': new FormControl('',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)]),
      'confirmPassword': new FormControl('', {validators: [Validators.required]}),
    },this.passwordMatch('password','confirmPassword'));
    this.jsonObject = {
      name: '',
      email: '',
      password: '',
      category: []
    }

  
    
}

  ngOnInit(): void {
    if(this.tokenService.getToken()){
      this.router.navigateByUrl('/signin');
    }else{
      this.categoryService.getCategories().subscribe(res =>{
        this.categories = res;
    });
    }
}



  register(): void{
    this.submitted = true;
    this.jsonObject = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      category: this.selectedCategories
    }
    this.spinner.show();
    this.authService.register(this.jsonObject).subscribe({
      next: res =>{
        this.alertService.showSuccess('Usuario registrado correctamente');
        // window.location.reload();
        setTimeout(() => {
          this.registerForm.reset();          
          this.spinner.hide();
          this.selectedCategories = [];
          this.counterActionCat = 0;
          this.submitted = false;
        }, 1000);
  
      },
      error: err =>{
        this.alertService.showError('Error al registrar el usuario');
      }
    });
  }


  onCategoriesChanged(categories: number[]){
    this.counterActionCat++;
    this.selectedCategories = categories;
  }


  // Method to validate password and confirmPassword match
  passwordMatch(password: string, confirmPassword: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }


  //Methdo to validate the email Exists
  emailValid(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null > =>{
      return this.userService.existEmail(control.value).pipe(
        map(res =>{
          let aux: any = res;
          if(aux.exists){
            return {'exists': aux.exists};
          }else{
            return null;
          }
        })
      );
    }
  }

  //Method to validate the userName Exists
  userNameValid(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null > =>{
      return this.userService.existName(control.value).pipe(
        map(res =>{
          let aux: any = res;
          if(aux.exists){            
            return {'exists': aux.exists};
          }else{
            return null;
          }
        })
      );
    };
  }

  

}

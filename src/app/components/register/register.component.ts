import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl, ValidationErrors, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { UserService } from 'src/app/services/users/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CategoryService } from 'src/app/services/categories/category.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    
  // Declaration Vars
  registerForm: FormGroup;
  categories: string[] = [];
  jsonObject: User;
 
  constructor(private userService: UserService, private categoryService: CategoryService, private authService: AuthService) { 
    this.registerForm = new FormGroup({
      'name': new FormControl('', {validators: Validators.required, asyncValidators: this.userNameValid()}),
      'email': new FormControl('',[Validators.required, Validators.email]),
      'password': new FormControl('',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)]),
      'confirmPassword': new FormControl('', {validators: [Validators.required]}),
      'category': new FormArray([], [Validators.required, this.minSelections(3)])
    }, this.passwordMatch('password','confirmPassword'));
    this.jsonObject = {
      name: '',
      email: '',
      password: '',
      category: []
    }
   
    
}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(res =>{
      this.categories = res;
      console.log(this.categories);
  });
  }


  register(): void{
    this.jsonObject = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      category: this.registerForm.value.category
    }
    this.authService.register(this.jsonObject).subscribe({
      next: res =>{
        console.log(res);
      },
      error: err =>{
        console.log(err);
      }
    });
  }
  
  minSelections(min: number): ValidatorFn {
    return (control: AbstractControl) =>{
      console.log(control.value);
      if (control.value && control.value.length < min) {
        return {minSelections: true};
      }
      return null;
    };
  }

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



  matchPasswords(): ValidatorFn{
    return (control: AbstractControl): { [key: string]: any} | null =>{
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      console.log(control.get('confirmPassword')?.errors);
      
      return password && confirmPassword && password.value !== confirmPassword.value ? {'mismatch': true} : null;
    }
  }


  //Method to validate the userName Exists
  userNameValid(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null > =>{
      return this.userService.userNameValidate(control.value).pipe(
        map(res =>{
          let aux: any = res;
          return res ? {'exists': aux.exists} : null;
        })
      );
    };
  }

  

}

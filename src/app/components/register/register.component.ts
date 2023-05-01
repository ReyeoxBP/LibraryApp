import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl, ValidationErrors, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { UserService } from 'src/app/services/users/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CategoryService } from 'src/app/services/categories/category.service';
import { User } from 'src/app/models/user';
import { Category } from 'src/app/models/category';
import { AlertService } from 'src/app/services/alert/alert.service';

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
  showErrorCategory: boolean = false;
 
  constructor(private userService: UserService, private categoryService: CategoryService, private authService: AuthService, private alertService: AlertService) { 
    this.registerForm = new FormGroup({
      'name': new FormControl('', {validators: Validators.required, asyncValidators: this.userNameValid()}),
      'email': new FormControl('',[Validators.required, Validators.email]),
      'password': new FormControl('',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)]),
      'confirmPassword': new FormControl('', {validators: [Validators.required]}),
      'category': new FormArray([], [Validators.required, this.minSelections(3)])
    },this.passwordMatch('password','confirmPassword'));
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
  });

  this.categories.forEach(categoria =>{
    const control = new FormControl(false); 
    this.registerForm.addControl(categoria.description, control);
});
  }


  register(): void{
    this.submitted = true;
    this.jsonObject = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      category: this.registerForm.value.category
    }
    this.authService.register(this.jsonObject).subscribe({
      next: res =>{
        this.alertService.showSuccess('Usuario registrado correctamente');
      },
      error: err =>{
        console.log(err);
        this.alertService.showError('Error al registrar el usuario');
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

  onCheckboxChange(event: any) {    
    const selectedCategories = (this.registerForm.controls['category'] as FormArray);
    if (event.target.checked) {
      selectedCategories.push(new FormControl(parseInt(event.target.value)));
    } else {
      const index = selectedCategories.controls
      .findIndex(x => x.value === event.target.value);
      selectedCategories.removeAt(index);
    }

    if(selectedCategories.length===0){
      this.showErrorCategory = true;
    }
    
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

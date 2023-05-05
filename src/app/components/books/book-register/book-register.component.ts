import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/categories/category.service';
import { Book } from '../../../models/book';
import { TokenStorageService } from '../../../services/auth/token-storage.service';
import { Router } from '@angular/router';
import { BookService } from '../../../services/books/book.service';
import { AlertService } from '../../../services/alert/alert.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-book-register',
  templateUrl: './book-register.component.html',
  styleUrls: ['./book-register.component.scss']
})
export class BookRegisterComponent implements OnInit {

  selectedCategories: number[] = [];  
  categories: Category[] = [];
  counterActionCat: number = 0;
  book: Book | undefined;
  standardPrice: string = '';
  standardIsbn: string = '';
  constructor(private categoryService: CategoryService,
     private tokenService: TokenStorageService,
      private router: Router, 
      private bookService: BookService,
      private alertService: AlertService,
      private location: Location) {
    
   }
  
  registerBook = new FormGroup({
    title: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    resume: new FormControl('', Validators.required),
    image: new FormControl('', [Validators.required, Validators.pattern(/^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)$/)]),
    url: new FormControl('', [Validators.required, Validators.pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/)]),
    userRegister: new FormControl('', Validators.required),
    public: new FormControl(false, Validators.required),
    isbn13: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),

  });
  ngOnInit(): void {

    if(this.tokenService.getToken()){
    this.categoryService.getCategories().subscribe(res =>{
      this.categories = res;
      console.log(this.categories);
    });
  }else{
    this.router.navigate(['/signin']);
  }

  }

  onCategoriesChanged(category: number[]){
    this.counterActionCat++;
    this.selectedCategories = category;
  }

  onclickbutton(evt: any){
    console.log(evt);
    console.log(this.registerBook.value);
    console.log(this.selectedCategories);
  }



  onSubmit() {
    const userObject = this.tokenService.getUser();
    this.registerBook.value.userRegister = userObject.user.userId;
    let objectJson = {
      title: this.registerBook.value.title,
      author: this.registerBook.value.author,
      resume: this.registerBook.value.resume,
      image: this.registerBook.value.image ? this.registerBook.value.image : 'data:image/jpeg;base64,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',
      url: this.registerBook.value.url,
      userRegister: this.registerBook.value.userRegister,
      public: this.registerBook.value.public,
      isbn13: this.registerBook.value.isbn13 ? this.registerBook.value.isbn13 : '',
      price: this.registerBook.value.price ? this.registerBook.value.price : '',
      category: this.selectedCategories
    }
    this.bookService.createBook(objectJson).subscribe({
      next: res => {
        this.alertService.showSuccess('Libro registrado exitosamente');
        this.router.navigate(['/']);
      },
      error: err => {
        this.alertService.showError(err.error.message);
      }
    });
  }

  back(): void {
    this.location.back();
  }
  

}

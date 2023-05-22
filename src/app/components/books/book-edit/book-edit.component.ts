import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../services/books/book.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Book } from '../../../models/book';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TokenStorageService } from '../../../services/auth/token-storage.service';
import { Category } from '../../../models/category';
import { AlertService } from '../../../services/alert/alert.service';
import { Location } from '@angular/common';
import { CategoryService } from '../../../services/categories/category.service';
@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.scss']
})
export class BookEditComponent implements OnInit {
  book: Book;
  selectedCategories: number[] = [];
  categories: Category[] = [];
  counterActionCat: number = 0;
  constructor(public bookService: BookService, private route: ActivatedRoute, public spinner: NgxSpinnerService, private tokenService: TokenStorageService, private alertService: AlertService, private location: Location, private categoryService: CategoryService) {
    this.book  = {
      title: '',
      author: '',
      resume: '',
      image: '',
      url: '',
      userRegister: '',
      category: [],
      public: false,
      isbn13: 0,
      price: ''
    };
   }

  ngOnInit(): void {
    this.spinner.show();
    const id = this.route.snapshot?.paramMap.get('id');
    this.getCategories();
    this.getDetailInfo(id!);
  }

  

  editBook = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    author: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    resume: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(600)]),
    image: new FormControl('', [Validators.required, Validators.pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/)]),
    url: new FormControl('', [Validators.required, Validators.pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/)]),
    public: new FormControl(false, Validators.required),

  });

  onCategoriesChanged(category: number[]) {
    this.counterActionCat++;
    this.selectedCategories = category;
  }



  //Method to get categories
  getCategories(): void {
    this.categoryService.getCategories().subscribe(res => {
      res.forEach(element => {
        element.checked = false;
      });
      this.categories = res;
    });
  }
  

  editBookFn() {
    const userObject = this.tokenService.getUser();
    let objectJson = {
      id: this.book?.id,
      title: this.editBook.value.title,
      author: this.editBook.value.author,
      resume: this.editBook.value.resume,
      image: this.editBook.value.image,
      url: this.editBook.value.url,
      userRegister: userObject.user?.userId,
      public: this.editBook.value.public,
      isbn13: false ? this.editBook.value.isbn13 : '',
      price: false ? this.editBook.value.price : '',
      category: this.selectedCategories
    }
    this.spinner.show();
    this.bookService.editBook(objectJson).subscribe({
      next: res => {
        this.alertService.showSuccess('Se ha editado de manera correcta.');
        this.back();
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      },
      error: err => {
        this.alertService.showError(err.error.message);
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      }
    });
  }


  getDetailInfo(id: string) :void{
    this.bookService.getAll().subscribe(res =>{
      this.book = res.filter(book => book.id?.toString() === id)[0];
      this.editBook.patchValue({
        title: this.book?.title,
        author: this.book?.author,
        resume: this.book?.resume,
        image: this.book?.image,
        url: this.book?.url,
        public: this.book?.public,
      });
      this.onCategoriesChanged(this.book?.category);
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    });
  }


  back(): void {
    this.location.back();
  }



}

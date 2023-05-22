import {Component,OnInit} from '@angular/core';
import {FormGroup,Validators,FormControl} from '@angular/forms';
import {Category} from '../../../models/category';
import {CategoryService} from '../../../services/categories/category.service';
import {Book} from '../../../models/book';
import {TokenStorageService} from '../../../services/auth/token-storage.service';
import {Router} from '@angular/router';
import {BookService} from '../../../services/books/book.service';
import {AlertService} from '../../../services/alert/alert.service';
import {Location} from '@angular/common';
import {NgxSpinnerService} from 'ngx-spinner';
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
    private location: Location,
    private spinner: NgxSpinnerService) {

  }

  registerBook = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    author: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    resume: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(600)]),
    image: new FormControl('', [Validators.required, Validators.pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/)]),
    url: new FormControl('', [Validators.required, Validators.pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/)]),
    public: new FormControl(false, Validators.required),

  });
  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.categoryService.getCategories().subscribe(res => {
        this.categories = res;
      });
    } else {
      this.router.navigate(['/signin']);
    }
  }

  onCategoriesChanged(category: number[]) {
    this.counterActionCat++;
    this.selectedCategories = category;
  }


  registerBookFn() {
    const userObject = this.tokenService.getUser();
    let objectJson = {
      title: this.registerBook.value.title,
      author: this.registerBook.value.author,
      resume: this.registerBook.value.resume,
      image: this.registerBook.value.image ? this.registerBook.value.image : '',
      url: this.registerBook.value.url,
      userRegister: userObject.user?.userId,
      public: this.registerBook.value.public,
      isbn13: false ? this.registerBook.value.isbn13 : '',
      price: false ? this.registerBook.value.price : '',
      category: this.selectedCategories
    }
    this.spinner.show();
    this.bookService.createBook(objectJson).subscribe({
      next: () => {
        this.alertService.showSuccess('Libro registrado exitosamente');
        this.back();
        this.spinner.hide();
      },
      error: (err) => {
        this.alertService.showError(err.error.message);
      }
    });
  }

  back(): void {
    this.location.back();
  }


}

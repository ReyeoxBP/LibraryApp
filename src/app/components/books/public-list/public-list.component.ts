import { Component, OnInit } from '@angular/core';
import { Book } from '../../../models/book';
import { TokenStorageService } from '../../../services/auth/token-storage.service';
import { Router } from '@angular/router';
import { BookService } from '../../../services/books/book.service';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/categories/category.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-public-list',
  templateUrl: './public-list.component.html',
  styleUrls: ['./public-list.component.scss']
})
export class PublicListComponent implements OnInit {

  searchText: string = '';
  categories: Category[] =[];
  books: Book[] = [];
  publicBooks: Book[] = [];
  publicBooksBackup: Book[] = [];
  firstTimeFiltered: boolean = true;
  
  constructor(private tokenService: TokenStorageService,
     private router: Router,
     private bookService: BookService,
     private categoryService: CategoryService,
     private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    if(this.tokenService.getToken()){
          this.bookService.getBooksByOwner().subscribe((books: Book[]) => {
            this.books = books;
          });
          this.bookService.getAll().subscribe((books: Book[]) => {  
            books = books.filter(book => book.public);
            this.publicBooksBackup = books;
            this.publicBooks = books;
          });
          this.categoryService.getCategories().subscribe((categories: Category[]) => {
            this.categories = categories;
          });
          this.spinner.hide();
    }else{
      this.router.navigate(['/signin']);
    }
  }


  filterBooks = (evt: number[]) : void =>{
    this.firstTimeFiltered = true;
    let auxCat = evt;
    if(auxCat.length>0){
      this.publicBooks = this.publicBooksBackup.filter(book => book.category.some(cat => auxCat.includes(cat)));
    }else{
      this.publicBooks = this.publicBooksBackup;
    }
  }

  filterBooksByText = (evt: string) : void =>{
    this.searchText = evt;
    if(this.searchText.length>0){
      this.publicBooks = this.publicBooksBackup.filter(book => book.title.toLowerCase().includes(this.searchText.toLowerCase()));
    }else{
      this.publicBooks = this.publicBooksBackup;
    }
  }

}

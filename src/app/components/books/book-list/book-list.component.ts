import {Component,OnInit} from '@angular/core';
import { CategoryService } from '../../../services/categories/category.service';
import { Category } from '../../../models/category';
import { TokenStorageService } from '../../../services/auth/token-storage.service';
import { Router } from '@angular/router';
import { Book } from '../../../models/book';
import { BookService } from '../../../services/books/book.service';
@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  
  
  searchText: string = "";
  categories: Category[] = [];
  selectedCategory: number = 0;
  books: Book[] = [];
  filteredBooks: Book[] = [];
  categoriesBP: any[] = [];
  firstTimeFiltered: boolean = true;



  constructor(private categoryService: CategoryService
    , private tokenService: TokenStorageService
    , private router: Router
    , private bookService: BookService) {
    // const userCategories = this.tokenService.getUser();
    this.categoryService.getCategories().subscribe(res =>{
    
      res.forEach((element: any) => {
        this.categoriesBP.push({value: element.id, label: element.description});

      });
      // this.categoriesBP.filter(cat => userCategories.includes(cat));
      console.log(this.categoriesBP);
  });
  }

  ngOnInit(): void {
    if(this.tokenService.getToken()){
      this.getBooks();
    }else{
      this.router.navigate(['/signin']);
    }

  }


  filterBooks = (evt: any) : void =>{
    this.firstTimeFiltered = true;
    let auxCat = evt.detail.value;
    if(auxCat){
      this.filteredBooks = this.books.filter(book => book.category.includes(auxCat));
    }else{
      this.filteredBooks = this.books;
    }
  }




  getBooks = () : void =>{
    this.bookService.getBooksByOwner().subscribe((books: Book[]) =>{
      this.filteredBooks = books;
      this.books = books;

    });
  }



}

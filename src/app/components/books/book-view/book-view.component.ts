import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/books/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/auth/token-storage.service';
import { Book } from '../../../models/book';
import { CategoryService } from '../../../services/categories/category.service';
import { Category } from '../../../models/category';
@Component({
  selector: 'app-book-view',
  templateUrl: './book-view.component.html',
  styleUrls: ['./book-view.component.scss']
})
export class BookViewComponent implements OnInit {
  categoryList: Category[] = [];
  categoryString: string = '';
  book: Book | undefined ;
  constructor(private bookService: BookService, private route: ActivatedRoute, private tokenService: TokenStorageService, private router: Router,
    private categoryService: CategoryService) { }


  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(res =>{
      this.categoryList = res;
    });
    if(this.tokenService.getToken()){
      const categoryArray: string[] = [];
      const id = this.route.snapshot.paramMap.get('id');
      this.bookService.getBooksByOwner().subscribe(res =>{
        this.book = res.find(book => book.id.toString() === id);
        this.book?.category.forEach(element => {
          this.categoryList.forEach(res =>{
            if(res.id === element){
               categoryArray.push(res.description);
            }
          });
        });
        this.categoryString = categoryArray.join(', ');
      }); 
    }else{
      this.router.navigate(['/signin']);
    }
   
  }

}

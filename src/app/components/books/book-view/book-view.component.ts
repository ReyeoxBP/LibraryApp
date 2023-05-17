import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../services/books/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../../services/auth/token-storage.service';
import { Book } from '../../../models/book';
import { CategoryService } from '../../../services/categories/category.service';
import { Category } from '../../../models/category';
import { Location } from '@angular/common'; 
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-book-view',
  templateUrl: './book-view.component.html',
  styleUrls: ['./book-view.component.scss']
})
export class BookViewComponent implements OnInit {
  categoryList: Category[] = [];
  userId: String = "";
  categoryString: string = '';
  book: Book | undefined ;
  constructor(private bookService: BookService, private route: ActivatedRoute, private tokenService: TokenStorageService, private router: Router,
    private categoryService: CategoryService,
    private location: Location,
    private spinner: NgxSpinnerService) { 
      this.userId = this.tokenService.getUser().user.userId;
    }


  ngOnInit(): void {
    this.spinner.show();
    this.categoryService.getCategories().subscribe(res =>{
      this.categoryList = res;
    });
    if(this.tokenService.getToken()){
      const categoryArray: string[] = [];
      const id = this.route.snapshot.paramMap.get('id');
      this.bookService.getAll().subscribe(res =>{
        this.book = res.filter(book => book.id?.toString() === id)[0];
        this.book?.category.forEach(element => {
          this.categoryList.forEach(res =>{
            if(res.id === element){
                categoryArray.push(res.description);
            }
          });
        });
        this.categoryString = categoryArray.join(', ');
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      });
    }else{
      this.router.navigate(['/signin']);
    }
  }

  back(): void{
    this.location.back();
  }


  

}

import {Component,OnInit} from '@angular/core';
import { CategoryService } from 'src/app/services/categories/category.service';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  // i need to create a book array to store the books
  searchText: string = "";
  categories: Category[] = [];
  categoryFilter: string = "";


  books = [{
      "id": "6rr14lxl2m2",
      "title": "string3",
      "author": "string",
      "resume": "string",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbyJ2w1-M1esA7LNNYliGSa3fHrR05pfQ7hg&usqp=CAU",
      "url": "string",
      "userRegister": "sysd88ervo",
      "category": [
        2,
        3
      ],
      "public": true,
      "isbn13": 2,
      "price": "asdasdas"
    },
    {
      "id": "wy85a21q1qd",
      "title": "string1",
      "author": "string",
      "resume": "string",
      "image": "https://static.packt-cdn.com/products/9781785880230/cover/smaller",
      "url": "string",
      "userRegister": "sysd88ervo",
      "category": [
        2,
        3
      ],
      "public": true,
      "isbn13": 2,
      "price": "asdasdas"
    },
    {
      "id": "o5n8vhn7fho",
      "title": "string2",
      "author": "string",
      "resume": "string",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDn__No81oPR4hA9dOTUffJ98TTbYLgnSp2Ab-oM1XatooJxei6Cz91pDKqmArtrDwrq0&usqp=CAU",
      "url": "string",
      "userRegister": "sysd88ervo",
      "category": [
        2,
        3
      ],
      "public": true,
      "isbn13": 2,
      "price": "asdasdas"
    }
  ]



  deleteBook(id: string) {
    console.log(id)
  }

  constructor(private categoryService: CategoryService) {
    this.categoryService.getCategories().subscribe(res =>{
      this.categories = res;
      console.log(this.categories);
  });
  }

  ngOnInit(): void {}

}

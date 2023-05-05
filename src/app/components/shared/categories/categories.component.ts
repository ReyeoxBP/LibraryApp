import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  @Input() categories: Category[] = [];;
  @Input() selectedCategories: number[] = [];
  @Output() categoriesChanged = new EventEmitter<number[]>();
  constructor() { }

  ngOnInit(): void {
  }


  onCategoryChange(categoryId: number, event: any) {
    debugger;
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(x => x !== categoryId);
    }
    this.categoriesChanged.emit(this.selectedCategories);
  }

  cleanSelectedCategories() {
    this.selectedCategories = [];
    this.categoriesChanged.emit(this.selectedCategories);
  }

}

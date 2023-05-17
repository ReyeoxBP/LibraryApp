import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
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
    this.selectedCategories = this.selectedCategories || [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['selectedCategories'] && this.selectedCategories){
      this.selectedCategories = [...this.selectedCategories];
      this.updateCheckedState();
    }
    
  }

  updateCheckedState(){
    for(const category of this.categories){
      category.checked = this.selectedCategories.includes(category.id);      
    }
  }


  onCategoryChange(categoryId: number, event: any) {
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(x => x !== categoryId);
    }
    this.categoriesChanged.emit(this.selectedCategories);
  }


}

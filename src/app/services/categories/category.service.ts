import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';


interface Category {
  id: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:3001/';


  constructor(private http: HttpClient) { }

  getCategories(): Observable<string[]>{
    return this.http.get<Category[]>(this.apiUrl + 'category').pipe(
      map(categories => categories.map(category=> category.description))
    )
  }
}

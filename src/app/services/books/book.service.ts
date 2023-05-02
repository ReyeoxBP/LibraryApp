import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../../models/book';
import { TokenStorageService } from '../auth/token-storage.service';
import { User } from 'src/app/models/user';

interface BookResponse {
  cod: string,
  status: boolean,
}
@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:3001';
  constructor(private http: HttpClient, private tokenService: TokenStorageService) { }


  getBooksByOwner(): Observable<Book[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenService.getToken()}`,
    });
    return this.http.get<Book[]>(`${this.apiUrl}/books/owner`, { headers });
  }

  createBook(book: Book, user: User): Observable<BookResponse>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenService.getToken()}`,
    });
    return this.http.post<BookResponse>(`${this.apiUrl}/books/owner/`, {book, user} ,{ headers });
  }
}

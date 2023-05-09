import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) { }



  existName(name: string): Observable<boolean> { 
    return this.http.get<boolean>(`${this.apiUrl}/users/exist-name?name=${name}`);
  }

  existEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/users/exist-email?email=${email}`);
  }
}

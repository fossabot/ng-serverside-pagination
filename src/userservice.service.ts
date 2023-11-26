import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedUserData } from './app/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserList(pageNumber: Number, pageSize: Number): Observable<PagedUserData> {
    const url = `https://reqres.in/api/users?page=${pageNumber}&per_page=${pageSize}`;
    return this.http.get<PagedUserData>(url);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/User';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  Http: HttpClient;
  constructor(private http: HttpClient) { }

  AddUserToQueue(user: User): Observable<User[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<User[]>('https://localhost:44340/api/values/AddUser', user, httpOptions);
  }


  DeletFirstUserInArray(): Observable<User[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<User[]>('https://localhost:44340/api/values/DeleteUser', httpOptions);
  }
}

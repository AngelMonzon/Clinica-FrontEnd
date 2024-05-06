import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIRespuestaLogin } from '../interfaces/apiRespuestaLogin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "http://127.0.0.1:8050/api/";

  constructor(private http: HttpClient) { }

  login(credentials: { username: string, password: string }): Observable<APIRespuestaLogin> {
    return this.http.post<APIRespuestaLogin>(`${this.baseUrl}login`, credentials);
  }

  register(user: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}register`, user);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  }

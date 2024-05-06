import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoService {

  constructor(private http: HttpClient) {}

  getFileUrl(): Observable<string> {
    return this.http.get<string>('/api/uploads/logo.jpg');
  }

}

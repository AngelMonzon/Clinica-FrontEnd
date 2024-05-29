import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RayosXService {
  private baseUrl = 'http://127.0.0.1:8050/api';

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/upload/rayosX`, formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }

  listFiles(id: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/rayosX/${id}`);
  }

  getFile(fileName: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/rayosX/${fileName}`, { responseType: 'blob' });
  }

  deleteFile(fileName: string, id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/rayosX/${fileName}/${id}`);
  }
}

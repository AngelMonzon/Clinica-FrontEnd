import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gasto } from '../interfaces/gasto.interface';

@Injectable({
  providedIn: 'root'
})
export class GastoService {

  private apiUrl = 'http://localhost:8050/api/gastos';

  constructor(private http: HttpClient) { }

  getAllGastos(): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(this.apiUrl);
  }

  getGastoById(id: number): Observable<Gasto> {
    return this.http.get<Gasto>(`${this.apiUrl}/${id}`);
  }

  createGasto(gasto: Gasto): Observable<string> {
    return this.http.post<string>(this.apiUrl, gasto);
  }

  updateGasto(id: number, gasto: Gasto): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${id}`, gasto);
  }

  deleteGasto(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../interfaces/venta.interface';


@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = 'http://127.0.0.1:8050/ventas';

  constructor(private http: HttpClient) {}

  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  getVentasByDateRange(startDate: string, endDate: string): Observable<Venta[]> {
    console.log(`${this.apiUrl}/range?startDate=${startDate}&endDate=${endDate}`);

    return this.http.get<Venta[]>(`${this.apiUrl}/range?startDate=${startDate}&endDate=${endDate}`);
  }

  getVenta(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.apiUrl}/${id}`);
  }

  addVenta(venta: Venta): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(venta.fecha);
    return this.http.post(this.apiUrl, venta, { headers: headers, responseType: 'blob' });
  }

  deleteVenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

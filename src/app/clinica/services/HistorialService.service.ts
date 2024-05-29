// src/app/services/historial.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Historial } from '../interfaces/historial.interface';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  private baseUrl: string = "http://127.0.0.1:8050/api/historial";

  constructor(private http: HttpClient) { }

  // Obtener todos los historiales
  getHistoriales(): Observable<Historial[]> {
    return this.http.get<Historial[]>(`${this.baseUrl}/get`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un historial por ID
  getHistorialPorId(id: number): Observable<Historial[]>  {
    return this.http.get<Historial[]>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Agregar un nuevo historial
  agregarHistorial(historial: Historial): Observable<Historial> {
    return this.http.post<Historial>(`${this.baseUrl}/add`, historial).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un historial
  actualizarHistorial(id: number, historial: Historial): Observable<Historial> {
    return this.http.put<Historial>(`${this.baseUrl}/update/${id}`, historial).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un historial
  eliminarHistorial(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('An error occurred:', error.error.message);
    } else {
      // El backend devolvió un código de error
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    // Devuelve un observable con un mensaje de error
    return throwError('Something went wrong; please try again later.');
  }
}

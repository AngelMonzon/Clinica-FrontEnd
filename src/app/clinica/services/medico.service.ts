import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Medico } from '../interfaces/medico';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private baseUrl: string = "http://127.0.0.1:8050/api/medicos";

  constructor(private http: HttpClient) { }

  // Obtener todos los médicos
  getMedicos(): Observable<Medico[]> {
    return this.http.get<Medico[]>(`${this.baseUrl}/get`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un médico por ID
  getMedicoPorId(id: number): Observable<Medico> {
    return this.http.get<Medico>(`${this.baseUrl}/get/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Agregar un nuevo médico
  agregarMedico(medico: Medico): Observable<Medico> {
    return this.http.post<Medico>(`${this.baseUrl}/add`, medico).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un médico
  actualizarMedico(id: number, medico: Medico): Observable<Medico> {
    return this.http.put<Medico>(`${this.baseUrl}/update/${id}`, medico).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un médico
  eliminarMedico(id: number): Observable<any> {
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

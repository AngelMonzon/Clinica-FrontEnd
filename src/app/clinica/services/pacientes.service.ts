import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Paciente } from '../interfaces/paciente';
import {  map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  private baseUrl: string = "http://127.0.0.1:8050/api/pacientes";

  constructor(private http: HttpClient) { }

  // Obtener todos los pacientes
  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/get`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un paciente por ID
  getPaciente(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.baseUrl}/get/${id}`).pipe(
      catchError(this.handleError)
    )
  }

  // Agregar un nuevo paciente
  agregarPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.baseUrl}/add`, paciente).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un paciente existente
  actualizarPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.baseUrl}/update/${paciente.id}`, paciente).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un paciente
  eliminarPaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`).pipe(
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

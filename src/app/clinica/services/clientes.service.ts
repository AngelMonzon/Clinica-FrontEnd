import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Cliente } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private baseUrl: string = "http://127.0.0.1:8050/api/clientes";

  constructor(private http: HttpClient) { }

  // Obtener todos los clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseUrl}/get`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un cliente por ID
  getClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/get/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Agregar un nuevo cliente
  agregarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.baseUrl}/add`, cliente).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un cliente
  actualizarCliente(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.baseUrl}/update/${id}`, cliente).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un cliente
  eliminarCliente(id: number): Observable<any> {
    console.log("Cliente eliminado");

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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Clinica } from '../interfaces/clinica.interface';

@Injectable({
  providedIn: 'root'
})
export class ClinicaService {

  constructor(private http: HttpClient) { }

  private baseUrl: string = "http://127.0.0.1:8050/api/clinica";

  obtenerDatosClinica() {
    return this.http.get<Clinica>(`${this.baseUrl}/obtener`);
  }

  obtenerDatosClinicaPorId(id: number): Observable<Clinica> {
    const url = `${this.baseUrl}/obtener/${id}`;
    return this.http.get<Clinica>(url);
  }

  agregarDatosClinica(datosClinica: Clinica) {
    return this.http.post<Clinica>(`${this.baseUrl}/agregar`, datosClinica);
  }

  actualizarDatosClinica(id: number, datosClinica: Clinica) {
    return this.http.put<Clinica>(`${this.baseUrl}/actualizar/${id}`, datosClinica);
  }

  eliminarDatosClinica(id: number) {
    return this.http.delete<Clinica>(`${this.baseUrl}/eliminar/${id}`);
  }
}

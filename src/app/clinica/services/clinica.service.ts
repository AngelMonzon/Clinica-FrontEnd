import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { DatosClinica } from '../interfaces/datosClinica.interface';

@Injectable({
  providedIn: 'root'
})
export class ClinicaService {

  constructor(private http: HttpClient) { }

  private baseUrl: string = "http://127.0.0.1:8050/api/clinica";

  obtenerDatosClinica() {
    return this.http.get<any>(`${this.baseUrl}/obtener`);
  }

  obtenerDatosClinicaPorId(id: number): Observable<DatosClinica> {
    const url = `${this.baseUrl}/obtener/${id}`;
    return this.http.get<DatosClinica>(url);
  }

  agregarDatosClinica(datosClinica: any) {
    return this.http.post<any>(`${this.baseUrl}/agregar`, datosClinica);
  }

  actualizarDatosClinica(id: number, datosClinica: any) {
    return this.http.put<any>(`${this.baseUrl}/actualizar/${id}`, datosClinica);
  }

  eliminarDatosClinica(id: number) {
    return this.http.delete<any>(`${this.baseUrl}/eliminar/${id}`);
  }
}

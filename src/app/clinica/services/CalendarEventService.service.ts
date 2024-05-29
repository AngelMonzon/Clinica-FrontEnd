import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { EventRequest } from '../interfaces/EventRequest.interface';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {

  private baseUrl = 'http://127.0.0.1:8050/events'; // La URL base del backend, ajusta esto según tu configuración

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<CalendarEvent[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(events => {
        // Mapear cada evento y convertir sus propiedades de inicio y fin en objetos Date
        return events.map(event => {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
          return event;
        });
      })
    );
  }

  getAllEventsById(idPaciente: any): Observable<CalendarEvent[]> {
    return this.http.get<any[]>(this.baseUrl + '/paciente/' + idPaciente).pipe(
      map(events => {
        // Mapear cada evento y convertir sus propiedades de inicio y fin en objetos Date
        return events.map(event => {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
          return event;
        });
      })
    );
  }

  getEventsByMonth(month: number, year: number): Observable<CalendarEvent[]> {
    const params = {
      month: month.toString(),
      year: year.toString()
    };

    console.log("Citas");
    console.log(params);

    return this.http.post<CalendarEvent[]>(`${this.baseUrl}/by-month`, params);
  }


  addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    // Convertir las fechas a cadenas en formato ISO 8601
    const start = event.start.toISOString();
    const end = event.end ? event.end.toISOString() : null;

    // Crear un nuevo objeto con las fechas convertidas
    const eventToSend: CalendarEvent = { ...event, start, end };

    return this.http.post<CalendarEvent>(`${this.baseUrl}/add`, eventToSend);
  }

  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    console.log(event);

    return this.http.put<CalendarEvent>(`${this.baseUrl}/${event.id}`, event);
  }

  deleteEvent(id: any): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  findEventById(id: number): Observable<CalendarEvent> {
    return this.http.get<CalendarEvent>(`${this.baseUrl}/${id}`);
  }
}

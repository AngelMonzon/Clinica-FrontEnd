import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Cliente } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root'
})
export class HistorialComunicationService {

  private historialObservable = new Subject<{ action: string, data?: any }>();
  historialAgregado$ = this.historialObservable.asObservable();

  emitHistorialAgregado() {
    this.historialObservable.next({ action: 'crear' });
  }

}

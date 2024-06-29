import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaComunicationService {
  private ventaRealizadaSource = new Subject<void>();
  private dialogClosedSource = new Subject<void>();

  // Observable al que se pueden suscribir los componentes
  ventaRealizada$ = this.ventaRealizadaSource.asObservable();
  dialogClosed$ = this.dialogClosedSource.asObservable();

  // Método para notificar que una venta ha sido realizada
  notificarVentaRealizada() {
    this.ventaRealizadaSource.next();
  }

  notificarDialogoCerrado() {
    this.dialogClosedSource.next();
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Cliente } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteComunicacionService {

  private clienteAgregadoSource = new Subject<{ action: string, data?: any }>();
  clienteAgregado$ = this.clienteAgregadoSource.asObservable();

  emitClienteAgregado() {
    this.clienteAgregadoSource.next({ action: 'crear' });
  }

  emitClienteEditado(cliente: Cliente) {
    this.clienteAgregadoSource.next({ action: 'editar', data: cliente });
  }

  emitClienteBorrado() {
    this.clienteAgregadoSource.next({action: 'borrar'});
  }
}

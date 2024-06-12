import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Cliente } from '../interfaces/cliente';
import { Medico } from '../interfaces/medico';

@Injectable({
  providedIn: 'root'
})
export class MedicoComunicacionService {

  private medicoAgregadoSource = new Subject<{ action: string, data?: any }>();
  medicoAgregado$ = this.medicoAgregadoSource.asObservable();

  emitMedicoAgregado() {
    this.medicoAgregadoSource.next({ action: 'crear' });
  }

  emitMedicoEditado(medico: Medico) {
    this.medicoAgregadoSource.next({ action: 'editar', data: medico });
  }

  emitMedicoBorrado() {
    this.medicoAgregadoSource.next({action: 'borrar'});
  }
}

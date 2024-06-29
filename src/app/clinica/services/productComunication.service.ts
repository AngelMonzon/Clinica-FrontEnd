import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Producto } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoComunicacionService {

  private productoAgregadoSource = new Subject<{ action: string, data?: any }>();
  productoAgregado$ = this.productoAgregadoSource.asObservable();

  emitProductoAgregado() {
    this.productoAgregadoSource.next({ action: 'crear' });
  }

  emitProductoEditado(producto: Producto) {
    this.productoAgregadoSource.next({ action: 'editar', data: producto });
  }

  emitProductoBorrado() {
    this.productoAgregadoSource.next({ action: 'borrar' });
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../../services/product.service';
import { MessageService } from 'primeng/api';
import { ProductoComunicacionService } from '../../services/productComunication.service';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrl: './nuevo-producto.component.css',
  providers: [MessageService]
})
export class NuevoProductoComponent {
  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private messageService: MessageService,
    private productoComunicacionService: ProductoComunicacionService) {
    this.formulario = this.fb.group({
      id: [''],
      nombreProducto: ['', Validators.required],
      nombreGenerico: [''],
      categoria: [''],
      fechaManufactura: [''],
      fechaExpiracion: [''],
      codigoBarra: [''],
      cantidad: ['', Validators.required],
      precioCompra: ['', Validators.required],
      precioVenta: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.productoService.agregarProducto(this.formulario.value).subscribe(
        producto => {
          this.productoComunicacionService.emitProductoAgregado();
          this.formulario.reset();
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'A Ocurrido un Error' });
        }

      )
    } else {
      console.log('El formulario es inválido');
      this.formulario.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falta Llenar Campos' });
    }
  }

}

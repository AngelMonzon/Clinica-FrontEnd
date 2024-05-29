import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrl: './nuevo-producto.component.css'
})
export class NuevoProductoComponent {
  formulario: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      id: ['', Validators.required],
      nombreProducto: ['', Validators.required],
      nombreGenerico: ['', Validators.required],
      categoria: ['', Validators.required],
      fechaManufactura: ['', Validators.required],
      fechaExpiracion: ['', Validators.required],
      codigoBarra: ['', Validators.required],
      cantidad: ['', Validators.required],
      precioCompra: ['', Validators.required],
      precioVenta: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.formulario.valid) {
      console.log(this.formulario.value);
    } else {
      console.error('El formulario es inválido');
    }
  }

}

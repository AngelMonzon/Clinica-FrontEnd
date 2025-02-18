import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Historial } from '../../interfaces/historial.interface';
import { HistorialService } from '../../services/HistorialService.service';
import { HistorialComunicationService } from '../../services/HistorialComunication.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-anadir-registro',
  templateUrl: './anadir-registro.component.html',
  styleUrls: ['./anadir-registro.component.css'],
  providers: [MessageService]
})
export class AnadirRegistroComponent implements OnInit {

  @Input()
  pacienteId!: number;

  formulario!: FormGroup;
  inputs: any[] = ["Descripcion", "Precio", "Cantidad", "Total"];
  tiposPago: string[] = ['Efectivo', 'Tarjeta De Debito', 'Tarjeta De Credito'];

  constructor(private fb: FormBuilder,
              private historialService: HistorialService,
              private historialComunicationService: HistorialComunicationService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.initFormulario();
  }

  initFormulario(): void {
    this.formulario = this.fb.group({
      fechaRegistro: [new Date, Validators.required],
      descripcion: [null, Validators.required],
      precio: [null, Validators.required],
      cantidad: [1, Validators.required],
      total: [{ value: '', disabled: true }, Validators.required],
      tipoPago: ['Efectivo', Validators.required],
      pago: [null, Validators.required],
      observaciones: [null],
      });
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      // Crear objeto Historial a partir de los datos del formulario
      const nuevoRegistro: Historial = {
        fecha: this.formulario.value.fechaRegistro,
        descripcion: this.formulario.value.descripcion,
        precio: this.formulario.value.precio,
        cantidad: this.formulario.value.cantidad,
        total: this.formulario.value.precio * this.formulario.value.cantidad,
        tipoDePago: this.formulario.value.tipoPago,
        observaciones: this.formulario.value.observaciones,
        id: this.pacienteId,
        idTrabajo: null,
        debe: this.formulario.value.precio * this.formulario.value.cantidad - this.formulario.value.pago,
      };

      // Llamar al método del servicio para agregar un nuevo registro
      this.historialService.agregarHistorial(nuevoRegistro).subscribe(
        (historialAgregado) => {
          console.log('Registro agregado:', historialAgregado);
          this.historialComunicationService.emitHistorialAgregado();
          // Aquí puedes manejar la respuesta, como mostrar un mensaje de éxito o redirigir a otra página

          // Resetear el formulario
          this.formulario.reset();
          // Reestablecer el valor del campo fechaRegistro a la fecha actual
          this.formulario.patchValue({
            fechaRegistro: new Date(),
            tipoPago: 'Efectivo',
            cantidad: 1,
          });
          this.formulario.get('total')?.disable(); // Deshabilitar el campo total nuevamente después de resetear
          this.messageService.add({ severity: 'info', summary: 'Agregado', detail: 'Historial agregado' });
        },
        (error) => {
          console.error('Error al agregar el registro:', error);
          // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
        }
      );
    } else {
      this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Falta llenar campos' });
      this.formulario.markAllAsTouched();
    }
}


  pagoChangeTimer: any;

  onPayChange(costo: number) {
    // Cancela el temporizador anterior si existe
    clearTimeout(this.pagoChangeTimer);

    let multiplicador = 1;

    if (this.formulario.get("cantidad")?.value > 1) {
      multiplicador = this.formulario.get("cantidad")?.value;

      console.log("Es mayor");

    }

    // Actualizar titulo en BD
    this.pagoChangeTimer = setTimeout(() => {
      this.formulario.get("total")?.setValue((
        costo * multiplicador));
    }, 2000);
  }

  cantidadChangeTimer: any;

  onQuantyChange(cantidad: number) {
    // Cancela el temporizador anterior si existe
    clearTimeout(this.cantidadChangeTimer);

    // Actualizar titulo en BD
    this.cantidadChangeTimer = setTimeout(() => {
      if (this.formulario.get("precio")?.value) {
        this.formulario.get("total")?.setValue((
          cantidad * this.formulario.get("precio")?.value));
      }
    }, 2000);
  }

  clear() {
    this.formulario.reset();
    // Establecer la fecha actual en el campo 'fechaRegistro' después de reiniciar el formulario
    this.formulario.patchValue({
        fechaRegistro: new Date(),
        tipoPago: 'Efectivo',
        cantidad: 1,
    });
    this.formulario.get('total')?.disable(); // Deshabilitar el campo 'total' si es necesario
}

}

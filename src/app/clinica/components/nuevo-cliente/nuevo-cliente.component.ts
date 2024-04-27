import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';
import { Cliente } from '../../interfaces/cliente';
import { ClienteComunicacionService } from '../../services/ClienteComunicacionService.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrl: './nuevo-cliente.component.css'
})
export class NuevoClienteComponent implements OnInit {

  clienteForm: FormGroup;

  generos: any;  // Opcional, si quieres tener una lista de géneros

  constructor(
    private fb: FormBuilder,
    private service: ClientesService,
    private clienteComunicacionService: ClienteComunicacionService,
    public ref: DynamicDialogRef) {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{3,}$/)]],
      edad: [null, [Validators.required, Validators.min(0)]],
      genero: ['', Validators.required],
      email: ['', Validators.email],
      telefono: [''],
      contacto: [''],
      telefono2: [''],
      fechaRegistro: [new Date(), Validators.required]
    });
  }
  ngOnInit(): void {
    this.generos = [
      { name: 'Femenino', code: 'Femenino' },
      { name: 'Masculino', code: 'Masculino' },
  ];  }

  onSubmit() {
    // Aquí puedes manejar la lógica para guardar el cliente
    const cliente: Cliente = this.clienteForm.value;

      this.service.agregarCliente(cliente).subscribe(
        response => {
          this.clienteComunicacionService.emitClienteAgregado();  // Emitir el evento
          console.log('Cliente agregado:', response);
          this.ref.close();
        },
        error => {
          console.error('Error al agregar el cliente:', error);

        }
      );

  }

}

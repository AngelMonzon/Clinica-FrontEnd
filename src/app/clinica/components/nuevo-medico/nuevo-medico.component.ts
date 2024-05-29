import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';
import { Cliente } from '../../interfaces/cliente';
import { ClienteComunicacionService } from '../../services/ClienteComunicacionService.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MedicoService } from '../../services/medico.service';
import { Medico } from '../../interfaces/medico';


@Component({
  selector: 'app-nuevo-medico',
  templateUrl: './nuevo-medico.component.html',
  styleUrl: './nuevo-medico.component.css'
})
export class NuevoMedicoComponent {
  clienteForm: FormGroup;

  generos: any;  // Opcional, si quieres tener una lista de géneros

  constructor(
    private fb: FormBuilder,
    private service: MedicoService,
    private clienteComunicacionService: ClienteComunicacionService,
    public ref: DynamicDialogRef) {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{3,}$/)]],
      especialidad: [''],
      direccion: [''],
      telefono: [''],
      fechaInicio: [new Date()]
    });
  }
  ngOnInit(): void {
    this.generos = [
      { name: 'Femenino', code: 'Femenino' },
      { name: 'Masculino', code: 'Masculino' },
  ];  }

  onSubmit() {
    // Aquí puedes manejar la lógica para guardar el cliente
    const medico: Medico = this.clienteForm.value;

      this.service.agregarMedico(medico).subscribe(
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

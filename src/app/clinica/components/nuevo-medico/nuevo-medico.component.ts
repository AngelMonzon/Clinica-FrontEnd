import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteComunicacionService } from '../../services/ClienteComunicacionService.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MedicoService } from '../../services/medico.service';
import { Medico } from '../../interfaces/medico';
import { MedicoComunicacionService } from '../../services/MedicoComunication.service';


@Component({
  selector: 'app-nuevo-medico',
  templateUrl: './nuevo-medico.component.html',
  styleUrl: './nuevo-medico.component.css'
})
export class NuevoMedicoComponent {
  medicoForm!: FormGroup;

  generos: any;  // Opcional, si quieres tener una lista de géneros

  constructor(
    private fb: FormBuilder,
    private service: MedicoService,
    private medicoComunicacionService: MedicoComunicacionService,
    public ref: DynamicDialogRef) {
    this.medicoForm = this.fb.group({
      nombre: ['', [Validators.required]],
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
  ];
 }

  onSubmit() {
    // Aquí puedes manejar la lógica para guardar el cliente
    const medico: Medico = this.medicoForm.value;

      this.service.agregarMedico(medico).subscribe(
        response => {
          this.medicoComunicacionService.emitMedicoAgregado();  // Emitir el evento
          console.log('Cliente agregado:', response);
          this.ref.close();
        },
        error => {
          console.error('Error al agregar el cliente:', error);

        }
      );

  }

}

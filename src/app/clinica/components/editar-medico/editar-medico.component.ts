import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteComunicacionService } from '../../services/ClienteComunicacionService.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MedicoService } from '../../services/medico.service';
import { Medico } from '../../interfaces/medico';
import { MedicoComunicacionService } from '../../services/MedicoComunication.service';


@Component({
  selector: 'app-editar-medico',
  templateUrl: './editar-medico.component.html',
  styleUrl: './editar-medico.component.css'
})
export class EditarMedicoComponent {

  medico!: Medico;

  medicoForm: FormGroup;

  generos: any;  // Opcional, si quieres tener una lista de géneros

  constructor(
    private fb: FormBuilder,
    private service: MedicoService,
    private medicoComunicacionService: MedicoComunicacionService,
    public ref: DynamicDialogRef,
    @Inject(DynamicDialogConfig) public config: DynamicDialogConfig) {
      this.medico = this.config.data;
      this.medicoForm = this.fb.group({
        id: [this.medico.id],
        nombre: [this.medico.nombre, [Validators.required]],
        especialidad: [this.medico.especialidad],
        direccion: [this.medico.direccion],
        telefono: [this.medico.telefono],
        fechaInicio: [new Date(this.medico.fechaInicio)]
      });

  }
  ngOnInit(): void {
    this.generos = [
      { name: 'Femenino', code: 'Femenino' },
      { name: 'Masculino', code: 'Masculino' },
  ];
  this.medicoForm.get('nombre')?.disable();

}

  onSubmit() {
    const medico: Medico = this.medicoForm.value;
    console.log(medico);

      this.service.actualizarMedico(medico).subscribe(
        response => {
          this.medicoComunicacionService.emitMedicoEditado(medico);  // Emitir el evento
          console.log('Medico agregado:', response);
          this.ref.close();
        },
        error => {
          console.error('Error al agregar Medico:', error);

        }
      );

  }

}

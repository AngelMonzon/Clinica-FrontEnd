import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClinicaService } from '../../services/clinica.service';
import { MessageService } from 'primeng/api';
import { Clinica } from '../../interfaces/clinica.interface';

@Component({
  selector: 'app-configuracion-clinica',
  templateUrl: './configuracion-clinica.component.html',
  styleUrl: './configuracion-clinica.component.css',
  providers: [MessageService]
})
export class ConfiguracionClinicaComponent implements OnInit {
  // Formularios
  formulario!: FormGroup;

  clinica!: Clinica;

  constructor(
    private fb: FormBuilder,
    private clinicaService: ClinicaService,
    private messageService: MessageService) {
    this.formulario = this.fb.group({
      nombreClinica: [''],
      telefono: [''],
      direccion: [''],
      encabezadoInforme: [''],
    });
  }
  ngOnInit(): void {
    this.clinicaService.obtenerDatosClinicaPorId(1).subscribe(
      (datosClinica) => {
        this.clinica = datosClinica;

        // Actualiza el valor del control doctor después de obtener el paciente
        this.formulario.get('nombreClinica')?.setValue(this.clinica.nombreClinica);
        this.formulario.get('telefono')?.setValue(this.clinica.telefono);
        this.formulario.get('direccion')?.setValue(this.clinica.direccion);
        this.formulario.get('encabezadoInforme')?.setValue(this.clinica.encabezadoInforme);

      },
      (error) => {
        console.error("Error al obtener el paciente:", error);
      }
    );

  }



  onSubmit() {
    const datosClinica = this.formulario.value;
    console.log(datosClinica);

    this.clinicaService.actualizarDatosClinica(1, datosClinica).subscribe(
      (response) => {
        console.log('Datos de la clínica guardados en el backend:', response);
        // Manejar la respuesta del backend si es necesario
        this.messageService.add({ severity: 'info', summary: 'Datos Actualizados', detail: 'Los datos de la clinica han sido actualizados'});
      },
      (error) => {
        console.error('Error al guardar los datos de la clínica:', error);
        // Manejar el error si es necesario
      }
    );
  }
}

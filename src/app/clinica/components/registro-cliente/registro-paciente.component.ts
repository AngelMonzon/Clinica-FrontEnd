import { Component, Inject, Input } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Cliente } from '../../interfaces/cliente';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacientesService } from '../../services/pacientes.service';
import { Paciente } from '../../interfaces/paciente';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Medico } from '../../interfaces/medico';
import { MedicoService } from '../../services/medico.service';
import { RayosXComponent } from '../rayos-x/rayos-x.component';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-paciente.component.html',
  styleUrl: './registro-paciente.component.css',
  providers: [DatePipe, MessageService]
})
export class RegistroPacienteComponent {

  @Input()
  cliente!: Cliente;

  paciente!: Paciente;

  medicos!: Medico[];

  pacienteExiste: boolean = false;

  //Componente rayosX
  rayosXKey = 1;

  refreshRayosXComponent() {
    this.rayosXKey++;
  }

  // Formularios
  formulario!: FormGroup;

  antecedentesForm!: FormGroup;

  // Boton editar
  stateOptions: any[] = [{ label: 'Off', value: false }, { label: 'On', value: true }];

  editar: boolean = true;

  activeIndexx: number | number[] = 0;


  // Variables para inputs
  tratamientos: any[] | undefined = [
    { name: 'Ninguno', code: 'Ninguno' },
    { name: 'Medico', code: 'Medico' },
    { name: 'Dental', code: 'Dental' },
  ];

  generos: any[] | undefined = [
    { name: 'MASCULINO', code: 'MASCULINO' },
    { name: 'FEMENINO', code: 'FEMENINO', }
  ];

  meses: any[] | undefined = [
    { name: '1', code: '1' },
    { name: '2', code: '2' },
    { name: '3', code: '3' },
    { name: '4', code: '4' },
    { name: '5', code: '5' },
    { name: '6', code: '6' },
    { name: '7', code: '7' },
    { name: '8', code: '8' },
    { name: '9', code: '9' },
    { name: '0', code: '0' },
  ];

  higieneBucal: any[] | undefined = [
    { name: 'Buena', code: 'Buena' },
    { name: 'Mala', code: 'Mala' },
  ];

  constructor(
    @Inject(DynamicDialogRef) public ref: DynamicDialogRef,
    @Inject(DynamicDialogConfig) public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private pacientesService: PacientesService,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private medicoService: MedicoService,
    public dialogService: DialogService,
  ) {
    this.cliente = this.config.data;

    this.initFormulario();

    this.medicoService.getMedicos().subscribe(
      medicos => {
        this.medicos = medicos;

        console.log(this.medicos);
      }
    )

    this.pacientesService.getPaciente(this.cliente.id).subscribe(
      (paciente) => {
        this.paciente = paciente;
        console.log(paciente);
        console.log(this.paciente.doctor);
        console.log(this.cliente);

        // Actualiza el valor del control doctor después de obtener el paciente
        this.formulario.get('doctor')?.setValue(this.paciente.doctor);
        this.formulario.get('tratamiento')?.setValue(this.paciente.bajoTratamiento);
        this.formulario.get('domicilio')?.setValue(this.paciente.domicilio);
        this.formulario.get('telefonoDoctor')?.setValue(this.paciente.telefonoDoctor);
        this.formulario.get('medicamento')?.setValue(this.paciente.algunMedicamento);
        this.formulario.get('fechaRegistro')?.setValue(this.paciente.fechaRegistro);

        // Formulario antecedentes
        this.antecedentesForm.get('aparatoRespiratorio')?.setValue(this.paciente.aparatoRespiratorio);
        this.antecedentesForm.get('aparatoDigestivo')?.setValue(this.paciente.aparatoDigestivo);
        this.antecedentesForm.get('aparatoCardiovascular')?.setValue(this.paciente.aparatoCardiovascular);
        this.antecedentesForm.get('sistemaNervioso')?.setValue(this.paciente.sistemaNervioso);
        this.antecedentesForm.get('coagulacion')?.setValue(this.paciente.problemasDeCoagulacion);
        this.antecedentesForm.get('desmayos')?.setValue(this.paciente.desmayos);
        this.antecedentesForm.get('diabetes')?.setValue(this.paciente.diabetes);
        this.antecedentesForm.get('tiroides')?.setValue(this.paciente.tiroides);
        this.antecedentesForm.get('fuma')?.setValue(this.paciente.fuma);
        this.antecedentesForm.get('alcohol')?.setValue(this.paciente.alcohol);
        this.antecedentesForm.get('drogas')?.setValue(this.paciente.drogas);
        this.antecedentesForm.get('otros')?.setValue(this.paciente.otros);
        this.antecedentesForm.get('embarazada')?.setValue(this.paciente.embarazada);
        this.antecedentesForm.get('mesesEmbarazo')?.setValue(this.paciente.meses);
        this.antecedentesForm.get('higieneBucal')?.setValue(this.paciente.higieneBucal);
        this.antecedentesForm.get('anticonceptivos')?.setValue(this.paciente.anticonceptivos);
        this.antecedentesForm.get('tipoAnticonceptivo')?.setValue(this.paciente.tipoAnticonceptivo);

        this.pacienteExiste = true;
      },
      (error) => {
        console.error("Error al obtener el paciente:", error);
        this.paciente = this.defaultPaciente; // O cualquier valor por defecto o null
        console.log(this.paciente);

        this.messageService.add({ severity: 'info', summary: 'Advertencia', detail: 'No hay datos existentes' });
        this.formulario.get('doctor')?.setValue(this.paciente.doctor);
        this.pacienteExiste = false;
        this.formulario.get('tratamiento')?.setValue(this.paciente.bajoTratamiento);
        this.antecedentesForm.get('higieneBucal')?.setValue(this.paciente.higieneBucal);


      }
    );
}

ngOnInit() {
  this.toggleEditar();
}




activeIndexChange(index: number | number[]) {
  this.activeIndexx = index
}


// Editar formulario

toggleEditar() {
  this.editar = !this.editar;

  if (this.editar) {
    this.formulario.enable();
    this.antecedentesForm.enable();
  } else {
    this.formulario.disable();
    this.antecedentesForm.disable();
  }

  this.formulario.get('fecha')?.disable();
  this.formulario.get('paciente')?.disable();
  this.formulario.get('edad')?.disable();
  this.formulario.get('sexo')?.disable();
}

// Inicializar formularios
initFormulario() {
  this.formulario = this.fb.group({
    doctor: [null],
    paciente: [this.cliente?.nombre, Validators.required],
    domicilio: [''],
    edad: [this.cliente?.edad, Validators.required],
    sexo: [this.cliente?.genero, Validators.required],
    tratamiento: [null],
    fecha: [this.datePipe.transform(this.cliente?.fechaRegistro, 'yyyy-MM-dd')],
    telefonoDoctor: [''],
    medicamento: [''],
  });


  // Formulario antecedentes personales
  this.antecedentesForm = this.fb.group({
    aparatoRespiratorio: [false],
    aparatoDigestivo: [false],
    aparatoCardiovascular: [false],
    sistemaNervioso: [false],
    coagulacion: [false],
    desmayos: [false],
    diabetes: [false],
    tiroides: [false],
    fuma: [false],
    alcohol: [false],
    drogas: [false],
    otros: [''],
    embarazada: [false],
    mesesEmbarazo: [0],
    higieneBucal: [''],
    anticonceptivos: [false],
    tipoAnticonceptivo: ['']
  });
}

// ...

// Método para manejar el submit del formulario
onSubmit() {
  if (this.formulario.valid && this.antecedentesForm.valid) {
    const pacienteActualizado = this.construirObjetoPaciente();

    if (this.pacienteExiste) {
      this.actualizarPaciente(pacienteActualizado);
    } else {
      this.agregarPaciente(pacienteActualizado);
    }
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Paciente Actualizado' });
  } else {
    this.formulario.markAllAsTouched();
    this.antecedentesForm.markAllAsTouched();
    console.log('Error en la validación');
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Formulario no valido' });
  }
}

private construirObjetoPaciente(): Paciente {
  const fechaTransformada = this.datePipe.transform(this.formulario.get('fecha')?.value, 'yyyy-MM-dd');
  const fechaRegistro = fechaTransformada ? new Date(fechaTransformada) : new Date();

  return {
    id: this.cliente.id,
    doctor: this.formulario.get('doctor')?.value,
    paciente: this.formulario.get('paciente')?.value,
    domicilio: this.formulario.get('domicilio')?.value,
    edad: this.formulario.get('edad')?.value,
    sexo: this.formulario.get('sexo')?.value,
    bajoTratamiento: this.formulario.get('tratamiento')?.value,
    fechaRegistro: fechaRegistro,
    telefonoDoctor: this.formulario.get('telefonoDoctor')?.value,
    algunMedicamento: this.formulario.get('medicamento')?.value,
    aparatoRespiratorio: this.antecedentesForm.get('aparatoRespiratorio')?.value,
    aparatoDigestivo: this.antecedentesForm.get('aparatoDigestivo')?.value,
    aparatoCardiovascular: this.antecedentesForm.get('aparatoCardiovascular')?.value,
    sistemaNervioso: this.antecedentesForm.get('sistemaNervioso')?.value,
    problemasDeCoagulacion: this.antecedentesForm.get('coagulacion')?.value,
    desmayos: this.antecedentesForm.get('desmayos')?.value,
    diabetes: this.antecedentesForm.get('diabetes')?.value,
    tiroides: this.antecedentesForm.get('tiroides')?.value,
    fuma: this.antecedentesForm.get('fuma')?.value,
    alcohol: this.antecedentesForm.get('alcohol')?.value,
    drogas: this.antecedentesForm.get('drogas')?.value,
    otros: this.antecedentesForm.get('otros')?.value,
    embarazada: this.antecedentesForm.get('embarazada')?.value,
    meses: this.antecedentesForm.get('mesesEmbarazo')?.value,
    higieneBucal: this.antecedentesForm.get('higieneBucal')?.value,
    anticonceptivos: this.antecedentesForm.get('anticonceptivos')?.value,
    tipoAnticonceptivo: this.antecedentesForm.get('tipoAnticonceptivo')?.value,
  };
}

private actualizarPaciente(paciente: Paciente): void {
  this.pacientesService.actualizarPaciente(paciente).subscribe(
    (pacienteActualizado) => {
      console.log('Paciente actualizado:', pacienteActualizado);
      // Mostrar notificación o redirigir a otra página
    },
    (error) => {
      console.error('Error al actualizar el paciente:', error);
    }
  );
}

private agregarPaciente(paciente: Paciente): void {
  if (!paciente.higieneBucal) {
    paciente.higieneBucal = 'Buena';
  }

  this.pacientesService.agregarPaciente(paciente).subscribe(
    (pacienteAgregado) => {
      console.log('Paciente agregado:', pacienteAgregado);
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Paciente agregado correctamente' });
      // Puedes mostrar una notificación de éxito o redirigir a otra página
    },
    (error) => {
      console.error('Error al agregar el paciente:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el paciente' });
      // Puedes mostrar una notificación de error o manejar el error de otra manera
    }
  );
}



// Crear un objeto vacío de tipo Paciente
 defaultPaciente: Paciente = {
   id: 0,
   doctor: '',
   domicilio: '',
   telefonoDoctor: '8999',
   algunMedicamento: '',
   aparatoRespiratorio: false,
   aparatoDigestivo: false,
   aparatoCardiovascular: false,
   sistemaNervioso: false,
   problemasDeCoagulacion: false,
   desmayos: false,
   diabetes: false,
   tiroides: false,
   fuma: false,
   alcohol: false,
   drogas: false,
   otros: '',
   embarazada: false,
   meses: 0,
   higieneBucal: 'Buena',
   anticonceptivos: false,
   tipoAnticonceptivo: '',
   paciente: '',
   edad: 0,
   sexo: '',
   bajoTratamiento: 'Ninguno',
   fechaRegistro: new Date,
 };

 show() {
  this.ref = this.dialogService.open(RayosXComponent, {
      header: 'Rayos X de Paciente',
      width: '80vw',
      height: '100vh',
      modal:true,
      breakpoints: {
          '960px': '90vw',
          '640px': '90vw'
      },
      data: { idPaciente: this.paciente.id }
  });

 }

}

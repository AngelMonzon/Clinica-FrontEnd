import { Component, ViewChild } from '@angular/core';
import { Medico } from '../../interfaces/medico'; // Reemplaza Cliente por Medico
import { Table } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditarClienteComponent } from '../editar-cliente/editar-cliente.component';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { RegistroPacienteComponent } from '../registro-cliente/registro-paciente.component';
import { ClienteComunicacionService } from '../../services/ClienteComunicacionService.service';
import { MedicoService } from '../../services/medico.service';
import { EditarMedicoComponent } from '../editar-medico/editar-medico.component';
import { MedicoComunicacionService } from '../../services/MedicoComunication.service';

@Component({
  selector: 'app-tabla-doctor',
  templateUrl: './tabla-doctor.component.html',
  styleUrl: './tabla-doctor.component.css',
  providers: [MessageService]
})
export class TablaDoctorComponent {
  //Referencia al cuadro de dialogo que se abrira
  ref: DynamicDialogRef | undefined;

  @ViewChild('dt1') dt1?: Table;

  searchValue: string = '';

  medicos!: Medico[]; // Reemplaza Cliente por Medico

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  sizes!: any[];

  selectedSize: any = '';

  constructor(
    private medicosService: MedicoService, // Reemplaza ClientesService por MedicosService
    private messageService: MessageService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private medicoComunicacionService: MedicoComunicacionService
  ) { }

  ngOnInit() {
    // Rellenar variable medicos con los datos de la api
    this.medicosService.getMedicos().subscribe((medicos) => { // Reemplaza getClientes por getMedicos
      this.medicos = medicos; // Reemplaza clientes por medicos
      this.loading = false;

      this.medicos.forEach((medico) => (medico.fechaInicio = new Date(<Date>medico.fechaInicio))); // Reemplaza clientes por medicos
      console.log(medicos)
    });

    //Tamanos de la tabla
    this.sizes = [
      { name: 'Small', class: 'p-datatable-sm' },
      { name: 'Normal', class: '' },
      { name: 'Large', class: 'p-datatable-lg' }
    ];

    //Se ejecutara si se agrega un nuevo medico
    this.medicoComunicacionService.medicoAgregado$.subscribe(() => {
      this.loading = true;
      this.medicosService.getMedicos().subscribe((medicos) => {
        this.medicos = medicos;
        this.loading = false;
      });

      this.medicos.forEach((medico) => (medico.fechaInicio = new Date(<Date>medico.fechaInicio))); // Reemplaza clientes por medicos
    });
  }

  clear(table: any) {
    table.clear();
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt1?.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  //Diálogo de confirmación
  borrarConfirm(event: Event, medico: Medico) { // Reemplaza Cliente por Medico
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Se borrara permanentemente este archivo',
      header: 'Borrar',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
        this.medicosService.eliminarMedico(medico.id).subscribe(
          medico => {
            this.medicosService.getMedicos().subscribe(
              medicos => {
                this.medicos = medicos;
              }
            )
            this.messageService.add({ severity: 'info', summary: 'Confirmacion', detail: 'Doctor Eliminado' });
          }
        );
      },
      reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Operacion Cancelada' });
      }
  });
  }

  visible: boolean = false;

  showEdit(doctor: Medico) {
    this.ref = this.dialogService.open(EditarMedicoComponent, {
      header: 'Editar Doctor',
      width: '30%',
      modal: true,
      baseZIndex: 10000,
      data: doctor
    });

    // Escuchar el evento de cierre para realizar acciones después de cerrar el diálogo
    this.ref.onClose.subscribe(() => {
      // Puedes hacer algo aquí si es necesario
    });
  }
}

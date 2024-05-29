import { Component, Input, ViewChild } from '@angular/core';
import { Cliente } from '../../interfaces/cliente';
import { ClientesService } from '../../services/clientes.service';
import { Table } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NuevoClienteComponent } from '../nuevo-cliente/nuevo-cliente.component';
import { EditarClienteComponent } from '../editar-cliente/editar-cliente.component';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { RegistroPacienteComponent } from '../registro-cliente/registro-paciente.component';
import { Historial } from '../../interfaces/historial.interface';
import { HistorialService } from '../../services/HistorialService.service';


@Component({
  selector: 'app-tabla-paciente',
  templateUrl: './tabla-paciente.component.html',
  styleUrl: './tabla-paciente.component.css',
  providers: [MessageService]
})
export class TablaPacienteComponent {

  @Input()
  pacienteId!: number;

  //Referencia al cuadro de dialogo que se abrira
  ref: DynamicDialogRef | undefined;

  @ViewChild('dt1') dt1?: Table;

  searchValue: string = '';

  historial!: Historial[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  sizes!: any[];

  selectedSize: any = '';


  constructor(
    private historialService: HistorialService,
    private messageService: MessageService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    ) { }

  ngOnInit() {
    // Rellenar variable historial con los datos de la api
    this.historialService.getHistorialPorId(this.pacienteId).subscribe((historial) => {
      this.historial = historial;
      this.loading = false;

      this.historial.forEach((historial) => (historial.fecha = new Date(<Date>historial.fecha)));
    });

    //Tamanos de la tabla
    this.sizes = [
      { name: 'Small', class: 'p-datatable-sm' },
      { name: 'Normal', class: '' },
      { name: 'Large', class: 'p-datatable-lg' }
    ];

  }

  clear(table: any) {
    table.clear();
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt1?.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  //Metodo que abre la ventana para editar cliente
  showEdit(cliente: Cliente) {
    this.ref = this.dialogService.open(EditarClienteComponent, {
      header: 'Editars Paciente',
      width: '30vw',
      modal: true,
      data: cliente,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });
  }

  //Metodo que abre la ventana de registro del paciente
  showRegistro(cliente: Cliente) {
    this.ref = this.dialogService.open(EditarClienteComponent, {
      header: 'Editar Paciente',
      width: '30vw',
      modal: true,
      data: cliente,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });
  }

  visible: boolean = false;

  showDialog() {
    this.ref = this.dialogService.open(RegistroPacienteComponent, {
      header: 'Registro Clinico',
      width: '80%',
      modal: true,
      baseZIndex: 10000
    });

    // Escuchar el evento de cierre para realizar acciones después de cerrar el diálogo
    this.ref.onClose.subscribe(() => {
      // Puedes hacer algo aquí si es necesario
    });
  }

  //Dialogo de confirmacion

  borrarConfirm(event: Event, historial: Historial) {
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
              this.historialService.eliminarHistorial(historial.idTrabajo).subscribe(
                borrar => {
                  this.actualizarTabla();
                  this.messageService.add({ severity: 'info', summary: 'Confirmacion', detail: 'Paciente Eliminado' });
                }
              )
          },
          reject: () => {
              this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Operacion Cancelada' });
          }
      });
  }

  actualizarTabla() {
    this.loading = true;
    this.historialService.getHistorialPorId(this.pacienteId).subscribe((historial) => {
      this.historial = historial;
      this.loading = false;
      this.historial.forEach((historial) => (historial.fecha = new Date(<Date>historial.fecha)));
    });

  }
}

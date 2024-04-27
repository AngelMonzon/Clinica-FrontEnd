import { Component, ViewChild } from '@angular/core';
import { Cliente } from '../../interfaces/cliente';
import { ClientesService } from '../../services/clientes.service';
import { Table } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditarClienteComponent } from '../editar-cliente/editar-cliente.component';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { RegistroPacienteComponent } from '../registro-cliente/registro-paciente.component';
import { ClienteComunicacionService } from '../../services/ClienteComunicacionService.service';


@Component({
  selector: 'app-tabla-clientes',
  templateUrl: './tabla-clientes.component.html',
  styleUrl: './tabla-clientes.component.css',
  providers: [MessageService]
})
export class TablaClientesComponent {

  //Referencia al cuadro de dialogo que se abrira
  ref: DynamicDialogRef | undefined;

  @ViewChild('dt1') dt1?: Table;

  searchValue: string = '';

  clientes!: Cliente[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  sizes!: any[];

  selectedSize: any = '';


  constructor(
    private clientesService: ClientesService,
    private messageService: MessageService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private clienteComunicacionService: ClienteComunicacionService
    ) { }

  ngOnInit() {
    // Rellenar variable clientes con los datos de la api
    this.clientesService.getClientes().subscribe((clientes) => {
      this.clientes = clientes;
      this.loading = false;

      this.clientes.forEach((cliente) => (cliente.fechaRegistro = new Date(<Date>cliente.fechaRegistro)));
      console.log(clientes)
    });

    //Tamanos de la tabla
    this.sizes = [
      { name: 'Small', class: 'p-datatable-sm' },
      { name: 'Normal', class: '' },
      { name: 'Large', class: 'p-datatable-lg' }
    ];

    //Se ejecutara si se agrega un nuevo cliente
    this.clienteComunicacionService.clienteAgregado$.subscribe(() => {
      this.loading = true;
      this.clientesService.getClientes().subscribe((clientes) => {
        this.clientes = clientes;
        this.loading = false;
      });

      this.clientes.forEach((cliente) => (cliente.fechaRegistro = new Date(<Date>cliente.fechaRegistro)));

    });

    //Se ejecutara si se agrega un nuevo cliente
    this.clienteComunicacionService.clienteAgregado$.subscribe(() => {
      this.loading = true;
      this.clientesService.getClientes().subscribe((clientes) => {
        this.clientes = clientes;
        this.loading = false;
        this.clientes.forEach((cliente) => (cliente.fechaRegistro = new Date(<Date>cliente.fechaRegistro)));
      });


    });

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

  showDialog(cliente: Cliente) {
    this.ref = this.dialogService.open(RegistroPacienteComponent, {
      header: 'Registro Clinico',
      width: '80%',
      modal: true,
      baseZIndex: 10000,
      data: cliente
    });

    // Escuchar el evento de cierre para realizar acciones después de cerrar el diálogo
    this.ref.onClose.subscribe(() => {
      // Puedes hacer algo aquí si es necesario
    });
  }

  //Dialogo de confirmacion

  borrarConfirm(event: Event, cliente: Cliente) {
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
              this.messageService.add({ severity: 'info', summary: 'Confirmacion', detail: 'Paciente Eliminado' });
              this.clientesService.eliminarCliente(cliente.id).subscribe(
                () => {
                  this.clienteComunicacionService.emitClienteBorrado();
                }
              );

          },
          reject: () => {
              this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Operacion Cancelada' });
          }
      });
  }


}

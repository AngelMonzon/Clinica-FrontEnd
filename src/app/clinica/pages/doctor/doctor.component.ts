import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NuevoClienteComponent } from '../../components/nuevo-cliente/nuevo-cliente.component';
import { Cliente } from '../../interfaces/cliente';
import { ClienteComunicacionService } from '../../services/ClienteComunicacionService.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css',
  providers: [DialogService, MessageService]
})
export class DoctorComponent {
  ref: DynamicDialogRef | undefined;


  constructor(
    private service: ClientesService,
    public dialogService: DialogService,
    private clienteComunicacionService: ClienteComunicacionService,
    private messageService: MessageService,) {

  }
  ngOnInit(): void {
    this.service.getClientes().subscribe(
      (result) => {

      }
    )

    this.clienteComunicacionService.clienteAgregado$.subscribe(action => {
      if (action.action === 'crear') {
        console.log('Se ha creado un cliente.');
        this.messageService.add({ severity: 'info', summary: 'Confirmacion', detail: 'Se ha creado un cliente' });
      } else if (action.action === 'editar') {
        console.log('Se ha editado un cliente:');
        this.messageService.add({ severity: 'info', summary: 'Confirmacion', detail: 'Se ha editado un cliente' });
      }
    });

  }

  showNew() {
    this.ref = this.dialogService.open(NuevoClienteComponent, {
      header: 'Agregar Paciente',
      width: '30vw',
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });
  }

}

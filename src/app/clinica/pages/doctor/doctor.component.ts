import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClienteComunicacionService } from '../../services/ClienteComunicacionService.service';
import { MessageService } from 'primeng/api';
import { NuevoMedicoComponent } from '../../components/nuevo-medico/nuevo-medico.component';
import { MedicoComunicacionService } from '../../services/MedicoComunication.service';

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
    private medicoComunicacionService: MedicoComunicacionService,
    private messageService: MessageService,) {

  }
  ngOnInit(): void {
    this.service.getClientes().subscribe(
      (result) => {

      }
    )

    this.medicoComunicacionService.medicoAgregado$.subscribe(action => {
      if (action.action === 'crear') {
        console.log('Se ha agregado un Medico.');
        this.messageService.add({ severity: 'info', summary: 'Confirmacion', detail: 'Se ha agregado un Medico' });
      } else if (action.action === 'editar') {
        console.log('Se ha editado un cliente:');
        this.messageService.add({ severity: 'info', summary: 'Confirmacion', detail: 'Se ha editado un Medico' });
      }
    });

  }

  showNew() {
    this.ref = this.dialogService.open(NuevoMedicoComponent, {
      header: 'Agregar Doctor',
      width: '30vw',
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });
  }

}

import { Component, ViewChild } from '@angular/core';
import { Medico } from '../../interfaces/medico'; // Reemplaza Cliente por Medico
import { Table } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditarClienteComponent } from '../editar-cliente/editar-cliente.component';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { RegistroPacienteComponent } from '../registro-cliente/registro-paciente.component';
import { ClienteComunicacionService } from '../../services/ClienteComunicacionService.service';
import { MedicoService } from '../../services/medico.service';

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
    private clienteComunicacionService: ClienteComunicacionService
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
    this.clienteComunicacionService.clienteAgregado$.subscribe(() => {
      this.loading = true;
      this.medicosService.getMedicos().subscribe((medicos) => { // Reemplaza getClientes por getMedicos
        this.medicos = medicos; // Reemplaza clientes por medicos
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

  //Método que abre la ventana para editar médico
  showEdit(medico: Medico) { // Reemplaza Cliente por Medico
    // Implementa la lógica para abrir la ventana de edición
  }

  //Método que abre la ventana de registro del médico
  showRegistro(medico: Medico) { // Reemplaza Cliente por Medico
    // Implementa la lógica para abrir la ventana de registro
  }

  visible: boolean = false;

  showDialog(medico: Medico) { // Reemplaza Cliente por Medico
    // Implementa la lógica para abrir la ventana de registro clínico
  }

  //Diálogo de confirmación
  borrarConfirm(event: Event, medico: Medico) { // Reemplaza Cliente por Medico
    // Implementa la lógica para el diálogo de confirmación
  }
}

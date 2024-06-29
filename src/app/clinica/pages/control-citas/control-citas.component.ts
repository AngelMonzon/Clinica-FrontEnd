import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef, OnInit, ElementRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, } from 'date-fns';
import { Subject } from 'rxjs';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from 'primeng/dynamicdialog';
import { EditarCitasComponent } from '../../components/editar-citas/editar-citas.component';
import { CalendarEventService } from '../../services/CalendarEventService.service';
import { Calendar } from 'primeng/calendar';
import { Paciente } from '../../interfaces/paciente';
import { PacientesService } from '../../services/pacientes.service';
import { Cliente } from '../../interfaces/cliente';
import { ClientesService } from '../../services/clientes.service';
import { Medico } from '../../interfaces/medico';
import { MedicoService } from '../../services/medico.service';



const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
@Component({
  selector: 'app-control-citas',
  templateUrl: './control-citas.component.html',
  styleUrl: './control-citas.component.css',
  providers: [MessageService, DialogService]
})
export class ControlCitasComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  @ViewChild('scrollableDialog') private scrollableDialog!: ElementRef;

  view: CalendarView = CalendarView.Month;

  locale: string = 'es';

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  clientes: Cliente[] = [];

  medicos: Medico[] = [];

  //Variable para p-dialog
  visible: boolean = false;
  //Variable para p-dialog de edicion individual
  visibleIndividual: boolean = false;

  //Variable para boton de nuevo evento
  buttonNew: boolean = false;

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];

  eventsBase: CalendarEvent[] = [];

  eventsSeleccionados: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;


  constructor(
    private modal: NgbModal,
    private messageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private calendarEventService: CalendarEventService,
    private cdr: ChangeDetectorRef,
    private clientesService: ClientesService,
    private medicoService: MedicoService) {
  }

  ngOnInit(): void {
    //Obtener eventos de el backend
    this.updateEvents();

    this.clientesService.getClientes().subscribe(
      clientes => {
        this.clientes = clientes;
      }
    )

    this.medicoService.getMedicos().subscribe(
      medicos => {
        this.medicos = medicos;
      }
    )
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }, event: any): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.confirmationService.confirm({
      message: '¿Está seguro(a) de cambiar la fecha de esta cita?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.events = this.events.map((iEvent) => {
          if (iEvent === event) {
            console.log('Evento cambiado');
            setTimeout(() => {
              console.log('Hola');

              this.calendarEventService.updateEvent({
                ...event,
                start: newStart,
                end: newEnd,
              }).subscribe(
                event => {
                  this.messageService.add({ severity: 'info', summary: 'Confirmación', detail: 'Cita Cambiada' });
                });
            }, 2000);
            return {
              ...event,
              start: newStart,
              end: newEnd,
            };
          }

          return iEvent;
        });
        this.activeDayIsOpen = false;
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Operación cancelada', life: 3000 });
      }
    });
  }

  //Metodo que se ejecuta al seleccionar una cita en el calendario
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.showDialogIndividual(event);
  }

  addEvent(): void {
    console.log('hola');

    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 0, 0);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0, 0);

    let eventCustom: CalendarEvent = {
      title: 'Nueva Cita',
      start: start,
      end: end,
      color: colors['red'],
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      idPaciente: null,
      nombrePaciente: null,
    };

    this.events.push(eventCustom);

    this.calendarEventService.addEvent(eventCustom).subscribe(
      cita => {
        console.log('Paso');

        this.updateEvents()
      }
    );



    const table = document.getElementById('tabla-citas');


    //Desplazar hacia abajo
    setTimeout(() => {
      // Desplazar hacia abajo
      const table = document.getElementById('tabla-citas');
      if (table) {
        table.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }

      // Obtener la última fila de la tabla
      const lastRow = table?.querySelector('tbody tr:last-child');

      // Agregar clase de parpadeo a la última fila
      if (lastRow) {
        lastRow.classList.add('blink-effect');
      }
      }, 100);
      }

  deletingEvent: boolean = false;

  deleteEvent(eventToDelete: CalendarEvent) {

    this.deletingEvent = true;

    if (this.deletingEvent) {
      this.confirmationService.confirm({

        message: '¿Esta seguro(a) de borrar esta cita?',
        header: 'Confirmacion',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: "none",
        rejectIcon: "none",
        rejectButtonStyleClass: "p-button-text",
        accept: () => {
          this.messageService.add({ severity: 'info', summary: 'Confirmacion', detail: 'Cita eliminada' });

          this.events = this.events.filter((event) => event !== eventToDelete);
          this.calendarEventService.deleteEvent(eventToDelete.id).subscribe(
            (event) => {
              console.log("Cita Borrada");
              this.deletingEvent = false;
            }
          )

          this.eventsSeleccionados = this.events;
        },
        reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Operacion cancelada', life: 3000 });
          this.deletingEvent = false;
        }
      });
    }

  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }


  //Metodos para mostrar dialogos
  showDialog() {
    this.eventsSeleccionados = [];
    this.events.forEach(event => {
      this.eventsSeleccionados.push(event);
    });
    this.visible = true;
  }

  showDialogIndividual(event: CalendarEvent) {
    this.eventsSeleccionados = [];
    this.eventsSeleccionados.push(event);
    this.visible = true;
    this.buttonNew = true;
  }

  onDialogHide() {
    this.buttonNew = false;
    this.visible = false;
    this.eventsSeleccionados = [];

    this.cdr.detectChanges();
  }


  guardarCitasBd() {

    this.visible = false;


  }

  //Metodo que actualizara la lista de Eventos , dependiendo el mes seleccionado
  updateEvents(): void {
    const month = this.viewDate.getMonth() + 1; // getMonth() devuelve un valor de 0-11, por eso se suma 1
    const year = this.viewDate.getFullYear();

    this.calendarEventService.getEventsByMonth(month, year).subscribe(
      (events) => {
        this.events = events.map(event => {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
          return event;
        });

        this.eventsBase = this.events;
        this.eventsSeleccionados = this.events;
        console.log(this.events);
      }
    );
  }

  // Metodos para actualizar con la base de datos individualmente
  ///////////////////////////////////////////////////////////////

  // Titulo  ---------------------------------------------------------------------------------------------------------------------------------------------------------------
  titleChangeTimer: any;

  onTitleChange(event: CalendarEvent) {
    // Cancela el temporizador anterior si existe
    clearTimeout(this.titleChangeTimer);

    // Actualizar titulo en BD
    this.titleChangeTimer = setTimeout(() => {
      this.calendarEventService.updateEvent(event).subscribe();
    }, 2000);
  }

  // Paciente  ---------------------------------------------------------------------------------------------------------------------------------------------------------------
  onPacientChange(event: any, cita: CalendarEvent): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedPacienteNombre = String(selectElement.value);

    let selectedCliente = this.clientes.find(cliente => cliente.nombre === selectedPacienteNombre) || null;

    cita.idPaciente = selectedCliente?.id;

    cita.nombrePaciente = selectedPacienteNombre;

    console.log(cita.idPaciente);


    this.calendarEventService.updateEvent(cita).subscribe(
      cita => {
        console.log('Logrado');

      }
    )

  }

  // Medico  ---------------------------------------------------------------------------------------------------------------------------------------------------------------
  onMedicoChange(event: any, cita: CalendarEvent): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedMedicoNombre = String(selectElement.value);

    let selectedMedico = this.medicos.find(medico => medico.nombre === selectedMedicoNombre) || null;

    cita.medico = selectedMedicoNombre;


    this.calendarEventService.updateEvent(cita).subscribe(
      cita => {
        console.log('Logrado');

      }
    )

  }

  // Colores  ---------------------------------------------------------------------------------------------------------------------------------------------------------------

  colorChangeTimer: any;

  onColorChange(event: CalendarEvent) {
    // Cancela el temporizador anterior si existe
    clearTimeout(this.colorChangeTimer);

    // Actualizar titulo en BD
    this.colorChangeTimer = setTimeout(() => {
      this.calendarEventService.updateEvent(event).subscribe();
    }, 2000);
  }

  // Fecha  ---------------------------------------------------------------------------------------------------------------------------------------------------------------
  dateChangeTimer: any;

  onDateChange(event: CalendarEvent, calendario: number) {

    clearTimeout(this.dateChangeTimer);

    // Actualizar titulo en BD
    this.dateChangeTimer = setTimeout(() => {

      if (calendario === 1) {
        event.end = new Date(event.start);
        // Incrementar la hora en una unidad
        event.end.setHours(event.end.getHours() + 1);

        this.calendarEventService.updateEvent(event).subscribe();

        this.refresh.next();
      } else if(calendario === 2) {
        console.log('Hola');

        event.start = new Date(event.end.getFullYear(), event.end.getMonth(), event.end.getDate(), event.start.getHours())

        this.refresh.next();

        this.calendarEventService.updateEvent(event).subscribe(
          event => {
            this.refresh.next();
          }
        );

        this.eventsSeleccionados = this.events;

      }

    }, 1000);
  }

}

import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, } from 'date-fns';
import { Subject } from 'rxjs';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from 'primeng/dynamicdialog';
import { CalendarEventService } from '../../services/CalendarEventService.service';
import { Calendar } from 'primeng/calendar';
import { Cliente } from '../../interfaces/cliente';



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
  selector: 'app-editar-citas',
  templateUrl: './editar-citas.component.html',
  styleUrl: './editar-citas.component.css',
  providers: [MessageService, DialogService]
})
export class EditarCitasComponent implements OnInit {

  @Input()
  public cliente!: Cliente;

  //Variable para boton de nuevo evento
  buttonNew: boolean = false;

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];

  eventsBase: CalendarEvent[] = [];


  activeDayIsOpen: boolean = false;


  constructor(
    private modal: NgbModal,
    private messageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private calendarEventService: CalendarEventService,
    private cdr: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this.obtenerCitas();
  }


  addEvent(): void {
    console.log('hola');

    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 0, 0);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0, 0);

    let eventCustom: CalendarEvent = {
      title: 'Cita de ' + this.cliente.nombre,
      start: start,
      end: end,
      color: colors['red'],
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      idPaciente: this.cliente.id,
      nombrePaciente: this.cliente.nombre
    };
    console.log(this.cliente.nombre);


    this.events = [
      ...this.events,
      eventCustom
    ];

    this.calendarEventService.addEvent(eventCustom).subscribe(
      cita => this.obtenerCitas()
    );


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
        },
        reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Operacion cancelada', life: 3000 });
          this.deletingEvent = false;
        }
      });
    }

  }


  titleChangeTimer: any;

  onTitleChange(newTitle: string, event: CalendarEvent) {
    // Cancela el temporizador anterior si existe
    clearTimeout(this.titleChangeTimer);

    // Actualizar titulo en BD
    this.titleChangeTimer = setTimeout(() => {
      this.calendarEventService.updateEvent(event).subscribe();
    }, 2000);
  }



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

      }

    }, 1000);
  }



  guardarCitasBd() {

    this.events.forEach(event => {
      console.log(event);

      if (this.eventsBase.includes(event)) {

      } else {
        this.calendarEventService.addEvent(event).subscribe();
      }
    });

    this.eventsBase = this.events;

    this.refresh.next();
  }

  obtenerCitas() {
    this.calendarEventService.getAllEventsById(this.cliente.id).subscribe(
      (events) => {
        this.events = events;
        this.eventsBase = events;
      }
    );
  }

}

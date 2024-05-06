import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  items: any[] = [
    {
      titulo: "Pacientes",
      link: "pacientes"
    },
    {
      titulo: "Control de Citas",
      link: "control-citas"
    },
    {
      titulo: "Doctor",
      link: "doctor"
    },
    {
      titulo: "Ingresos y Gastos",
      link: "ingresos-gastos"
    },
    {
      titulo: "Farmacia",
      link: "farmacia"
    },
    {
      titulo: "Tratamiento",
      link: "tratamiento"
    },
    {
      titulo: "Prescripcion",
      link: "prescripcion"
    },
    {
      titulo: "Administracion",
      link: "administracion"
    },

  ]
}

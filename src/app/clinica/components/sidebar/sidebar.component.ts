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
      link: "pacientes",
      img: "paciente.png"
    },
    {
      titulo: "Citas",
      link: "control-citas",
      img: "cita.png"
    },
    {
      titulo: "Doctor",
      link: "doctor",
      img: "doctor.png"
    },
    {
      titulo: "Ingresos",
      link: "ingresos-gastos",
      img: "ingresosGastos.png"
    },
    {
      titulo: "Productos",
      link: "farmacia",
      img: "productos.png"
    },
    {
      titulo: "Tratamiento",
      link: "tratamiento",
      img: "tratamiento.png"
    },
    {
      titulo: "Prescripcion",
      link: "prescripcion",
      img: "prescripcion.png"
    }
  ]
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-anadir-registro',
  templateUrl: './anadir-registro.component.html',
  styleUrl: './anadir-registro.component.css'
})
export class AnadirRegistroComponent {
  inputs: any[] = ["Fecha", "Descripcion","Precio", "Cantidad", "Total", "Tipo de Pago"]
}

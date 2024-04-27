import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  ocultarSidebar: any = {display: 'none'};

  mostrarSidebar: any = {display: 'inline-block'};

  contenido: any = {padding: '20px', width: '100%', 'box-sizing': 'border-box'}

}

import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements  OnInit {

  //Estilos para sidebar
  sidebarStyle: any;

  ocultarSidebar: any = {display: 'none'};

  mostrarSidebar: any = {display: 'inline-block'};

  //Estilos para router outlet
  contenidoStyle: any;

  contenidoAgrandar: any = {padding: '20px', width: '100%', 'box-sizing': 'border-box'};

  contenido: any;

  ngOnInit(): void {
    if (window.innerWidth < 1350){
      this.sidebarStyle = this.ocultarSidebar;
      this.contenidoStyle = this.contenidoAgrandar;
    } else {
      this.sidebarStyle = this.mostrarSidebar;
      this.contenidoStyle = this.contenido;
    }
  }


  // Método que se ejecutará cuando cambie el tamaño de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    console.log(window.innerWidth);

    if (window.innerWidth < 1350){
      this.sidebarStyle = this.ocultarSidebar;
      this.contenidoStyle = this.contenidoAgrandar;
    } else {
      this.sidebarStyle = this.mostrarSidebar;
      this.contenidoStyle = this.contenido;
    }

    console.log("El tamaño de la pantalla ha cambiado");
  }

}

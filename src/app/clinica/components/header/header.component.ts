import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClinicaService } from '../../services/clinica.service';
import { Clinica } from '../../interfaces/clinica.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  sidebarVisible: boolean = false;

  clinicaDatos: Clinica = {
    id: 1,
    nombreClinica: "Clinica Dental",
    telefono: "",
    direccion: "",
    encabezadoInforme: ""
};

  constructor(
    private router: Router,
    private clinicaService: ClinicaService,
    private cdr: ChangeDetectorRef){

    this.clinicaService.obtenerDatosClinica().subscribe(
      datos => {
        if (Array.isArray(datos) && datos.length > 0) {
          this.clinicaDatos = datos[0]; // Ajuste para manejar el array
          console.log(this.clinicaDatos);
          this.cdr.markForCheck(); // O detectChanges
        } else {
          console.error('Datos de la clínica no válidos', datos);
        }
      }
    );

  }

  ngOnInit(): void {
    this.cdr.markForCheck();

  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';




import { ClinicaRoutingModule } from './clinica-routing.module';
import { LayoutComponent } from './pages/layout/layout.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { DoctorComponent } from './pages/doctor/doctor.component';
import { FarmaciaComponent } from './pages/farmacia/farmacia.component';
import { TratamientoComponent } from './pages/tratamiento/tratamiento.component';
import { PrescripcionComponent } from './pages/prescripcion/prescripcion.component';
import { IngresosGastosComponent } from './pages/ingresos-gastos/ingresos-gastos.component';
import { AdministracionComponent } from './pages/administracion/administracion.component';
import { ControlCitasComponent } from './pages/control-citas/control-citas.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { PrimengModule } from '../primeng/primeng.module';
import { FormsModule } from '@angular/forms';
import { TablaClientesComponent } from './components/tabla-clientes/tabla-clientes.component';
import { NuevoClienteComponent } from './components/nuevo-cliente/nuevo-cliente.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditarClienteComponent } from './components/editar-cliente/editar-cliente.component';
import { RegistroPacienteComponent } from './components/registro-cliente/registro-paciente.component';
import { TablaPacienteComponent } from './components/tabla-paciente/tabla-paciente.component';
import { AnadirRegistroComponent } from './components/anadir-registro/anadir-registro.component';
import { ConfiguracionClinicaComponent } from './components/configuracion-clinica/configuracion-clinica.component';
import { LogotipoComponent } from './components/logotipo/logotipo.component';
import { AuthGuard } from '../guards/auth.guard';
import { RegistroDoctorComponent } from './components/registro-doctor/registro-doctor.component';
import { TablaDoctorComponent } from './components/tabla-doctor/tabla-doctor.component';
import { NuevoMedicoComponent } from './components/nuevo-medico/nuevo-medico.component';
import { NuevoProductoComponent } from './components/nuevo-producto/nuevo-producto.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { EditarCitasComponent } from './components/editar-citas/editar-citas.component';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { RayosXComponent } from './components/rayos-x/rayos-x.component';





@NgModule({
  declarations: [
    LayoutComponent,
    PacientesComponent,
    DoctorComponent,
    FarmaciaComponent,
    TratamientoComponent,
    PrescripcionComponent,
    IngresosGastosComponent,
    AdministracionComponent,
    ControlCitasComponent,
    SidebarComponent,
    HeaderComponent,
    TablaClientesComponent,
    NuevoClienteComponent,
    EditarClienteComponent,
    RegistroPacienteComponent,
    TablaPacienteComponent,
    AnadirRegistroComponent,
    ConfiguracionClinicaComponent,
    LogotipoComponent,
    RegistroDoctorComponent,
    TablaDoctorComponent,
    NuevoMedicoComponent,
    NuevoProductoComponent,
    EditarCitasComponent,
    RayosXComponent,

  ],
  imports: [
    CommonModule,
    ClinicaRoutingModule,
    PrimengModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModalModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ConfirmationService, AuthGuard]
})
export class ClinicaModule { }

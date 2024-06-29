import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { AdministracionComponent } from './pages/administracion/administracion.component';
import { ControlCitasComponent } from './pages/control-citas/control-citas.component';
import { DoctorComponent } from './pages/doctor/doctor.component';
import { FarmaciaComponent } from './pages/farmacia/farmacia.component';
import { TratamientoComponent } from './pages/tratamiento/tratamiento.component';
import { PrescripcionComponent } from './pages/prescripcion/prescripcion.component';
import { IngresosGastosComponent } from './pages/ingresos-gastos/ingresos-gastos.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { AuthGuard } from '../guards/auth.guard';
import { PuntoVentaComponent } from './pages/punto-venta/punto-venta.component';
import { IngresosComponent } from './components/ingresos/ingresos.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { BalanceComponent } from './components/balance/balance.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'administracion', component: AdministracionComponent},
      { path: 'control-citas', component: ControlCitasComponent},
      { path: 'doctor', component: DoctorComponent},
      { path: 'farmacia', component: FarmaciaComponent},
      { path: 'ingresos-gastos', component: IngresosGastosComponent},
      { path: 'ingresos', component: IngresosComponent},
      { path: 'gastos', component: GastosComponent},
      { path: 'balance', component: BalanceComponent},
      { path: 'pacientes', component: PacientesComponent},
      { path: 'prescripcion', component: PrescripcionComponent},
      { path: 'tratamiento', component: TratamientoComponent},
      { path: 'venta', component: PuntoVentaComponent},
      { path: '**', redirectTo: 'pacientes'},
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicaRoutingModule { }

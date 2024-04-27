import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'clinica',
    loadChildren: () => import('./clinica/clinica.module').then( m => m.ClinicaModule ),
  },
  {
    path: '',
    redirectTo: 'clinica',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'clinica',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

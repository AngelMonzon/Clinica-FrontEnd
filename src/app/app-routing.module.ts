import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'clinica',
    loadChildren: () => import('./clinica/clinica.module').then( m => m.ClinicaModule ),
    canActivate: [AuthGuard]
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

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../clinica/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, map, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  logo?: string;


  formulario!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient) {
      this.verificarImagen('http://localhost:8050/uploads/logo.jpg', 'assets/images/logotipo.jpg')
      .then(validUrl => this.logo = validUrl);

    }

  onSubmit(): void {
    console.log('Entro');

    let username = this.formulario.get('user')?.value;
    let password = this.formulario.get('password')?.value;

    this.authService.login({ username, password }).pipe(
        catchError(error => {
            if (error.status === 401) {
                console.log('Credenciales inválidas');
                // Manejar el error 401 aquí, por ejemplo, mostrar un mensaje al usuario
                this.messageService.add({ severity: 'error', summary: 'Advertencia', detail: 'Contraseña Incorrecta' });
                return throwError(error);
            }
            // Reenviar el error para que sea manejado por el siguiente observador
            this.messageService.add({ severity: 'error', summary: 'Advertencia', detail: 'Usuario y Contraseña Incorrectos' });
            return throwError(error);
        })
    ).subscribe(response => {
        localStorage.setItem('token', response.token);
        console.log(response);
        // Redirigir a la página deseada después del inicio de sesión
        this.router.navigate(['/clinica']);
    });
}
  ngOnInit(): void {
    this.formulario = this.fb.group({
      user: [''],
      password: ['']
    });
  }


  verificarImagen(url: string, defaultUrl: string): Promise<string | undefined> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map(() => url), // Si la solicitud es exitosa, la URL es válida
      catchError(() => of(defaultUrl)) // Si hay un error, se devuelve la URL por defecto
    ).toPromise();
  }

}

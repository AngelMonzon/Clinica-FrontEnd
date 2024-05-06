import { Component } from '@angular/core';
import { AuthService } from '../clinica/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private authService: AuthService) { }

  register(username: string, password: string): void {
    this.authService.register({ username, password }).subscribe(response => {
      // Redirigir a la página deseada después del registro
    });
  }
}

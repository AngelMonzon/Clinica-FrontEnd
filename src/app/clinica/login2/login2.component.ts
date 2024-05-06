import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-login2',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>login2 works!</p>`,
  styleUrl: './login2.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login2Component { }

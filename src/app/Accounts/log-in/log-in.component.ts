import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule, CommonModule ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  constructor(private router: Router, private api: ApiService) {}

  showPassword: boolean = false;
  email: string = '';
  password: string = '';
  errorMessage: string = '';


  togglePassword() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    this.showPassword = !this.showPassword;
    passwordInput.type = this.showPassword ? 'text' : 'password';
  }

  onSubmit() {
    console.log("onSubmit")
    if (this.email === 'Saif@saif.com' && this.password === '123456') {
  
      this.router.navigate(['/LangingPage']);
    } else {
      this.errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    }
  }
}
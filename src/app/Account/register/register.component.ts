import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  firstrname: string = '';
  lastname: string = '';
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  asAdmin: boolean = false


  constructor(private http: ApiService, private toastr: ToastrService) {}

  onSubmit() {
    var payLoad = {
      'firstName': this.firstrname,
      'lastName': this.lastname,
      'email': this.email,
      'password': this.password
    };
    
      this.http.postData('api/Account/Register', payLoad).subscribe((response) => {
        localStorage.setItem('token', response.token)
        this.toastr.success("اهلا بكم في موقع عين الفهد", "تم تسجيل الدخول بنجاح",
          { progressAnimation: 'increasing',
            progressBar: true

           })
        window.location.href = '/LangingPage/MainScreenForMain'
      },(error) => {

        this.toastr.error("البريد الالكتروني موجود مسبقا", "فشل التسجيل ",
          { 
            progressBar: true,
            timeOut: 2000
           })
      })    
  }
}

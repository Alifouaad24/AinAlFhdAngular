import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.scss'
})
export class AddAdminComponent {

  admin = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };


  constructor(private http: ApiService, private toastr: ToastrService) {}

  onSubmit() {
console.log(this.admin)
    this.http.postData('api/Account/RegisterAdmin', this.admin).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message || 'تم إضافة الأدمن بنجاح');
        window.location.href = '/LangingPage/ShowAdmins'
      },
      error: (err) => {
        if (err.status === 409) {
          this.toastr.warning(err.error.message || 'الأدمن موجود مسبقاً');
        } else if (err.status === 400) {
          this.toastr.error('البيانات المدخلة غير صحيحة. الرجاء التأكد منها.');
        } else {
          this.toastr.error('حدث خطأ غير متوقع، يرجى المحاولة مجددًا');
        }
      }
    });
  }

}

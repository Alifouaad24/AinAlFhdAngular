import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-admins',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './show-admins.component.html',
  styleUrl: './show-admins.component.scss'
})
export class ShowAdminsComponent {
admins: any[] = [];
  loading = false;

  constructor(private http: ApiService) {}

  ngOnInit(): void {
    this.getAdmins();
  }

  getAdmins() {
    this.loading = true;
    this.http.getData('api/Account/GetAdmins').subscribe({
      next: (data) => {
        this.admins = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching admins:', err);
        this.loading = false;
      }
    });
  }

DeleteUser(id: string) {
  Swal.fire({
    title: 'هل أنت متأكد؟',
    text: 'لن تتمكن من التراجع عن هذا الإجراء!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'حذف',
    cancelButtonText: 'إلغاء'
  }).then((result) => {
    if (result.isConfirmed) {
      this.http.deleteData(`api/Account/${id}`).subscribe({
        next: () => {
          this.getAdmins();
          Swal.fire(
            'تم الحذف!',
            'تم حذف المستخدم بنجاح.',
            'success'
          );
        },
        error: () => {
          Swal.fire(
            'خطأ!',
            'حدث خطأ أثناء الحذف.',
            'error'
          );
        }
      });
    }
  });
}
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-show-amendent-log',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, RouterOutlet],
  templateUrl: './show-amendent-log.component.html',
  styleUrl: './show-amendent-log.component.scss'
})
export class ShowAmendentLogComponent implements OnInit {

  constructor(private http: ApiService, private router: Router) {}

  Logs?: any

  ngOnInit(): void {
    this.GetAllLogs() 
 }

  GetAllLogs(): void {
    this.http.getData('api/AmendmentLogs').subscribe((response) => {
      this.Logs = response
    })
  }

  EditLog(id: number): void {
    this.router.navigate(['/LangingPage/EditServiceForCustomer'], {queryParams: {'id': id}})
  }

  DeleteLog(id: number): void {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لا يمكنك التراجع بعد الحذف!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.deleteData(`api/AmendmentLogs/${id}`).subscribe((res) => {
          console.log(res);
          Swal.fire('تم الحذف!', 'تم حذف السجل بنجاح.', 'success');
        });
      }
    });
  }
  
}

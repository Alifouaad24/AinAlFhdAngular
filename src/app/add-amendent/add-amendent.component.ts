import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../Services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-amendent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-amendent.component.html',
  styleUrl: './add-amendent.component.scss'
})
export class AddAmendentComponent {

  /**
   *
   */
  constructor(private http: ApiService, private toastr: ToastrService) {}

  Description?: string

  AddAmendent(): void {
    if(this.Description == null || this.Description == ""){
      this.toastr.error("برجى ادخال اسم الخدمة", '')
    }
    else{
      var PayLoad = {
        'amendmentId': 0,
        'description': this.Description
      }
  
      this.http.postData('api/Amendments', PayLoad).subscribe((res) =>{
        console.log(res)
        this.toastr.success("تم حفظ الخدمة بنجاح", '')
      },(err) =>{
        this.toastr.error("حدث خطأ ما يرجى المحاولة مجددا", '')
      })
    }
  }

  

}

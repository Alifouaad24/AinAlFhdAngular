import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customers-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './customers-notes.component.html',
  styleUrl: './customers-notes.component.scss'
})
export class CustomersNotesComponent implements OnInit {

  allNotes: any[] = []

  constructor(private http: ApiService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.GetAllNotes()
  }

  GetAllNotes() {
    this.http.getData('api/RequestNotes').subscribe(res => {
      this.allNotes = res
    })
  }

  SetNoteAsRead(id: number) {
    this.http.putData(`api/RequestNotes/${id}`, {}).subscribe(res => {
      this.allNotes = this.allNotes.filter(el => {
        return el.id != id
      })
      this.toastr.success('تم التحويل الى تمت المشاهدة بنجاح')
    }, (error) => {
      this.toastr.error('خطا في تعديل الحالة, يرجى المحاولة مجددا')
    })
  }

  showNote(desc: string) {
    alert(desc);
  }


}

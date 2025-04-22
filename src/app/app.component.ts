import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from './Services/api.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HttpClientModule ],
  providers: [ApiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  version: string = '';
  /**
   *
   */
  constructor(private http: HttpClient) {
    this.checkVersion();
  }

  checkVersion() {
    this.http.get('assets/version.txt', { responseType: 'text' }).subscribe(newVersion => {
      if (this.version && this.version !== newVersion) {
        if (confirm('يوجد تحديث جديد، هل تريد إعادة تحميل الصفحة؟')) {
          window.location.reload();
        }
      }
      this.version = newVersion;
    });
  }

}

import { Component, inject } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { Receipt } from '../../Models/Recipt';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-last-some-recipts',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './last-some-recipts.component.html',
  styleUrl: './last-some-recipts.component.scss'
})
export class LastSomeReciptsComponent {

  title = 'Ain AlFahd Company';
  http = inject(ApiService);

  recipts: Receipt[] = [];

  getData(): void {
    this.http.getData("api/Reciept/GetLastFiveRecords").subscribe((r: Receipt[]) => {
      this.recipts = r;
      console.log(r)
    })
  }

  ngOnInit(): void {
    this.getData();

  }

  divideNum(num: number | undefined): string {
    if (num === undefined) {
      return 'N/A';
    }
    let magnitude = Math.pow(10, Math.floor(Math.log10(num) - 1));
    let final = Math.ceil(num / magnitude) * magnitude;
    return final.toLocaleString();
  }

}

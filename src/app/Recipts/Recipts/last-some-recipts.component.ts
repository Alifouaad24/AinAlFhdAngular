import { Component, inject } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { Receipt } from '../../Models/Recipt';
import { ActivatedRoute, Route, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';

@Component({
  selector: 'app-last-some-recipts',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './last-some-recipts.component.html',
  styleUrl: './last-some-recipts.component.scss'
})
export class ReciptsComponent {

constructor(private route: ActivatedRoute) {}
  title = 'Ain AlFahd Company';
  http = inject(ApiService);

  recipts: Receipt[] = [];

  totalCost: number = 0;
  totalLines: number = 0;
  totalProfit: number = 0

  getData(): void {
    this.http.getData("api/Reciept").subscribe((r: Receipt[]) => {
      this.recipts = r;
      this.recipts.forEach(recipt => {
        this.totalProfit +=  recipt.totalPriceFromCust!;
        this.totalCost +=  recipt.cost!;
        this.totalLines++;
      });
      console.log(r)
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['updated'] === 'true') {
        this.getData();
      }
    });
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


  DeleteRecipt(rId: number | undefined): void {
    this.http.deleteData(`api/Reciept/${rId}`).subscribe(
      (response: any) => {
        if(response){
          this.recipts = this.recipts.filter(rec => rec.recieptId != rId)
        }
      },
    );
  }
}

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
  shipIdToFilter?: number

  getData(): void {
    this.http.getData("api/Reciept").subscribe((r: Receipt[]) => {
      this.recipts = r;
      this.recipts.forEach(recipt => {
        this.totalProfit +=  recipt.totalPriceFromCust!;
        this.totalCost +=  recipt.cost!;
        this.totalLines++;
      });
      console.log(r)
      if(this.shipIdToFilter != null ){
        this.filterRecipts(this.shipIdToFilter)
      }
    })

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['updated'] === 'true') {
        this.getData();
      }
    });

    this.route.queryParams.subscribe(param => {
      if(param['ShippIdToFilter'] != null){
        console.log("ShippIdToFilter: ",param['ShippIdToFilter'])
        this.shipIdToFilter = param['ShippIdToFilter'];
      }
    })
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


  filterRecipts(id: number){
    this.recipts = this.recipts.filter(el => el.shippingBatchId == id)

    this.totalProfit = 0;
    this.totalCost = 0;
    this.totalLines = 0;

    this.recipts.map(el =>{
      this.totalProfit +=  el.totalPriceFromCust!;
      this.totalCost +=  el.cost!;
      this.totalLines++;
    })

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

import { Component, inject } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { Receipt } from '../../Models/Recipt';
import { ActivatedRoute, Route, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { RoleService } from '../../Auth/role.service';

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
  roleService = inject(RoleService);


  isAdmin(): boolean {
    return this.roleService.hasRole('Admin');
  }

  recipts: Receipt[] = [];

  totalCost: number = 0;
  totalLines: number = 0;
  totalProfit: number = 0
  shipIdToFilter?: number
  profitsInIQ?: number
  totalWeight: number = 0
  profitsInUSD: number = 0
  exChangeRate: number = 0 
  totalSellUSD: number = 0
  oneKGProfitInUSD: number = 0
  oneKGProfitInIQ: number = 0
  totalCostIQ: number = 0
  pureAcc: number = 0;
  currentUser: string = ""

  getData(): void {
    this.http.getData("api/Reciept").subscribe((r: Receipt[]) => {
      this.recipts = r;

      this.recipts = this.recipts.filter(el => el.shippingBatchId != null).sort((a, b) => {
        const dateA = a.recieptDate ? new Date(a.recieptDate) : new Date(0);
        const dateB = b.recieptDate ? new Date(b.recieptDate) : new Date(0);
        return dateA.getTime() - dateB.getTime(); 
      });
      this.recipts.forEach(recipt => {
        this.totalProfit +=  recipt.totalPriceFromCust!;
        this.totalCost +=  recipt.cost!;
        this.totalLines++;
        this.totalWeight += recipt.weight!;
        //this.totalSellUSD += recipt.sellingUSD!;
        //this.totalCostIQ += recipt.costIQ!;
      });
      this.totalCostIQ = this.totalCost * this.exChangeRate;
      this.totalSellUSD = this.totalProfit / this.exChangeRate;

      this.profitsInIQ = this.totalProfit - this.totalCostIQ;
      this.profitsInUSD = this.totalSellUSD - this.totalCost;
      this.oneKGProfitInUSD = this.profitsInUSD / this.totalWeight
      this.oneKGProfitInIQ = this.profitsInIQ / this.totalWeight

      this.pureAcc = this.totalSellUSD - this.totalCost;

      console.log(r)
      if(this.shipIdToFilter != null ){
        this.filterRecipts(this.shipIdToFilter)
      }
    })

  }

  getExChg(): void {
    this.http.getData("api/Enviroment/GetExChg").subscribe(res => {
      this.exChangeRate = res.exchangeRate;
      console.log(res)
    })
  }

  ngOnInit(): void {
    this.getExChg();
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

    const magnitude = 1000;
    return (Math.ceil(num / magnitude) * magnitude).toLocaleString();

    // let magnitude = Math.pow(10, Math.floor(Math.log10(num) - 1));
    // let final = Math.ceil(num / magnitude) * magnitude;
    // return final.toLocaleString();
  }


  filterRecipts(id: number){
    this.recipts = this.recipts
    .filter(el => el.shippingBatchId == id) 
    .sort((a, b) => {
      const dateA = a.recieptDate ? new Date(a.recieptDate) : new Date(0);
      const dateB = b.recieptDate ? new Date(b.recieptDate) : new Date(0);
      return dateA.getTime() - dateB.getTime(); 
    });
  

    this.totalProfit = 0;
    this.totalCost = 0;
    this.totalLines = 0;
    this.totalWeight = 0;
    this.totalSellUSD = 0;
    this.totalLines = 0;
    this.totalCostIQ = 0;


    this.profitsInIQ = 0;
    this.profitsInUSD = 0;
    this.oneKGProfitInUSD = 0;
    this.oneKGProfitInIQ = 0;

    this.recipts.map(el =>{
      this.totalProfit +=  el.totalPriceFromCust!;
      this.totalCost +=  el.cost!;
      this.totalLines++;
      this.totalWeight += el.weight!;
      //this.totalSellUSD += el.sellingUSD!;
      //this.totalCostIQ += el.costIQ!;
    });

    this.totalCostIQ = this.totalCost * this.exChangeRate;
    this.totalSellUSD = this.totalProfit / this.exChangeRate;
    this.profitsInIQ = this.totalProfit - this.totalCostIQ;
    this.profitsInUSD = this.totalSellUSD - this.totalCost;
    this.oneKGProfitInUSD = this.profitsInUSD / this.totalWeight
    this.oneKGProfitInIQ = this.profitsInIQ / this.totalWeight
    this.pureAcc = this.totalSellUSD - this.totalCost;

    console.log(this.recipts)
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

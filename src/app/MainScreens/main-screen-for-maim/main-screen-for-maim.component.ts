import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RoleService } from '../../Auth/role.service';
import { Receipt } from '../../Models/Recipt';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-screen-for-maim',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './main-screen-for-maim.component.html',
  styleUrl: './main-screen-for-maim.component.scss'
})
export class MainScreenForMaimComponent implements OnInit {
  ngOnInit(): void {
    this.getData()
    this.getExChg()
  }

  role = inject(RoleService)
  http = inject(ApiService)

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

  
  IsAdmin(): boolean{
    return this.role.hasRole('Admin');
  }

   getData(): void {
      this.http.getData("api/Reciept").subscribe((r: Receipt[]) => {
        this.recipts = r;

        this.recipts = this.recipts.filter(el => el.shippingBatchId != null).sort((a, b) => {
          const dateA = a.recieptDate ? new Date(a.recieptDate) : new Date(0);
          const dateB = b.recieptDate ? new Date(b.recieptDate) : new Date(0);
          return dateB.getTime() - dateA.getTime(); 
        });
    
        // حساب القيم الإجمالية
        this.recipts.forEach(recipt => {
          this.totalProfit += recipt.totalPriceFromCust!;
          this.totalCost += recipt.cost!;
          this.totalLines++;
          this.totalWeight += recipt.weight!;
        });
    
        this.totalCostIQ = this.totalCost * this.exChangeRate;
        this.totalSellUSD = this.totalProfit / this.exChangeRate;
    
        this.profitsInIQ = this.totalProfit - this.totalCostIQ;
        this.profitsInUSD = this.totalSellUSD - this.totalCost;
        this.oneKGProfitInUSD = this.profitsInUSD / this.totalWeight;
        this.oneKGProfitInIQ = this.profitsInIQ / this.totalWeight;
    
        this.pureAcc = this.totalSellUSD - this.totalCost;
      });
    }

    getExChg(): void {
      this.http.getData("api/Enviroment/GetExChg").subscribe(res => {
        this.exChangeRate = res.exchangeRate;
      })
    }

    getLastReceiptDate(): Date | null {
      if (!this.recipts || this.recipts.length === 0) {
        return null;
      }
    
      return new Date(this.recipts.sort((a, b) => new Date(b.recieptDate!).getTime() - new Date(a.recieptDate!).getTime())[0].recieptDate!);
    }
    
    
}

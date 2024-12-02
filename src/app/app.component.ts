import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';


import { ApiService } from './Services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { Receipt } from './Models/Recipt';
import { OrdersComponent } from './orders/orders.component';
import { CustomersComponent } from './customers/customers.component';
import { routes } from './app.routes';
import { RouterLink, RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HttpClientModule, CommonModule, OrdersComponent, CustomersComponent],
  providers: [ApiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Ain AlFahd Company';
  http = inject(ApiService);

  recipts: Receipt[] = [];
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
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

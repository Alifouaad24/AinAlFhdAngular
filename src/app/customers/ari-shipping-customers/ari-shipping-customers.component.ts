import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ari-shipping-customers',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule, CommonModule],
  templateUrl: './ari-shipping-customers.component.html',
  styleUrl: './ari-shipping-customers.component.scss'
})
export class AriShippingCustomersComponent implements OnInit {

  constructor(private http: ApiService) {}

  shippingTypes?: any
  Customers?: any
  AllCustomers?: any
  ngOnInit(): void {
    this.getAllShippingTypes()
  }

  getAllShippingTypes(): void{
    this.http.getData(`api/ShippingTypes`).subscribe((response: any) => {
      this.shippingTypes = response
      const shipp = this.shippingTypes.find((_sh: any) => _sh.description.includes("شحن جوي"));
      const id = shipp!.shippingTypeId!
      if(id != null){
        this.GetAirShippingCustomers(id)
      }
    })
  }

  GetAirShippingCustomers(id: number): void{
    this.http.getData(`api/Customers/GetAllByShippingType/${id}`).subscribe((res: any) =>{
      this.Customers = res
      this.AllCustomers = res
    })
  }

  FilterTablie(ev: any): void{
    var name = ev.target.value!;
    this.Customers = this.AllCustomers
    this.Customers = this.Customers.filter((el: any) => {
      return el.custName.includes(name) || el.custMob.includes(name) 
    })
  }

}

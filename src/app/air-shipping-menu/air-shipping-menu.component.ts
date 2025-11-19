import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-air-shipping-menu',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './air-shipping-menu.component.html',
  styleUrl: './air-shipping-menu.component.scss'
})
export class AirShippingMenuComponent implements OnInit{
  constructor(private http: ApiService) {}
    ShippId: number = 0
    shippingTypes?: any

  ngOnInit(): void {
    this.http.getData('api/ShippingTypes').subscribe(res => {
      this.shippingTypes = res
      this.ShippId = this.shippingTypes.find((s: any) => s.description.includes('شحن جوي'))?.shippingTypeId;
      console.log("ShippId: ",this.ShippId)
    })
  }
}

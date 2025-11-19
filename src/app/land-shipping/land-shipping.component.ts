import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-land-shipping',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './land-shipping.component.html',
  styleUrl: './land-shipping.component.scss'
})
export class LandShippingComponent implements OnInit {

  constructor(private http: ApiService) {}
  ShippId: number = 0
  shippingTypes?: any

  ngOnInit(): void {
    this.http.getData('api/ShippingTypes').subscribe(res => {
      this.shippingTypes = res
      this.ShippId = this.shippingTypes.find((s: any) => s.description.includes('شحن بري'))?.shippingTypeId;
      console.log(this.ShippId)
    })
  }

}

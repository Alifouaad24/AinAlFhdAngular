import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {

  constructor(private http: ApiService) { }

  customers: any;
  originalCustomers: any;

  ShippingTypes: any;
  selectedShipping: any;
  labb: string = "الزبائن"

  ngOnInit(): void {
    this.GetAllCustomers()
    this.GetAllShippingTypes()
  }

  GetAllShippingTypes() {
    this.http.getData(`api/ShippingTypes`).subscribe((res: any[]) => {
      console.log(res)
      this.ShippingTypes = res

    });
  }

  getWhatsAppLink(phone: string): string {
    const formatted = phone?.replace(/^0/, '964');
    return `https://wa.me/${formatted}`;
  }

  GetAllCustomers() {
    this.http.getData('api/Packages').subscribe(res => {
      console.log(res)
      this.customers = res
      this.originalCustomers = res
    })
  }

getCustomersbyShippId(shippId: number) {
  this.customers = this.originalCustomers;
  this.customers = this.customers.filter((c: any) => c.shippingType.shippingTypeId === shippId);
  this.customers = this.customers.filter(
    (value: any, index: any, self: any) =>
      index === self.findIndex(
        (t: any) => t.customer.custMob === value.customer.custMob
      )
  );

  const found = this.ShippingTypes.find((s: any) => s.shippingTypeId === shippId);
  this.labb = found ? `زبائن ${found.description}` : '';
}

}

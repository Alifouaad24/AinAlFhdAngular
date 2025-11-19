import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shipping-duration',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './shipping-duration.component.html',
  styleUrl: './shipping-duration.component.scss'
})
export class ShippingDurationComponent implements OnInit {

  constructor(private toastr: ToastrService) { }
  SippingTypes: any[] = [];
  api = inject(ApiService);
  shippId?: number
  arrivelDate: string = new Date().toISOString().split('T')[0];
  Start?: string
  End?: string
  ShowModel: boolean = false
  city?: string
  ngOnInit(): void {
    this.GetAllShippingTypes()
  }

  GetAllShippingTypes(): void {
    this.api.getData('api/ShippingTypes').subscribe((data) => {
      this.SippingTypes = data;
    })
  }

  SetShippId(event: number) {
    this.shippId = event;
    console.log(event);

    const shipp = this.SippingTypes.find(el => el.shippingTypeId === this.shippId);

    if (!shipp) return;

    if (shipp.description.includes('جوي')) {
      this.city = 'دبي';
    } else if (shipp.description.includes('بحري')) {
      this.city = 'الشارقة';
    } else if (shipp.description.includes('بري')) {
      this.city = 'الكويت';
    }

    console.log(shipp);
  }



  Search() {
    if (this.shippId != null && this.arrivelDate != null) {
      this.ShowModel = false
      this.api.getData(`api/ShippingDuration/${this.shippId}/${this.arrivelDate}`).subscribe(res => {
        console.log(res)
        this.Start = res.start
        this.End = res.end
        this.ShowModel = true
      })
    } else {
      this.toastr.error('الرجاء ملئ الحقول بشكل صحيح')
    }
  }

  GoToWhatsApp() {
    const phoneNumber = '19165968865';
    const message = encodeURIComponent('مرحبًا، أود التواصل بخصوص التأخير.');
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  }


}

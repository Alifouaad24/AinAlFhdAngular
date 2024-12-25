import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-add-shipping-batch',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule ],
  templateUrl: './add-shipping-batch.component.html',
  styleUrl: './add-shipping-batch.component.scss'
})
export class AddShippingBatchComponent implements OnInit {
  ngOnInit(): void {
    this.GetAllShippingTypes();
  }
  ShippingDate: string = new Date().toISOString().split('T')[0];

  shippingTypes: any[] = [];
  selectedShippingType: string = '';
  api = inject(ApiService);
  
  GetAllShippingTypes(): void{
    this.api.getData('api/ShippingTypes').subscribe((data) =>{
      this.shippingTypes = data;
    })
  }


}

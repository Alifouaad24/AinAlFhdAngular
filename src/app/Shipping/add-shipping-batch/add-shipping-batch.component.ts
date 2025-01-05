import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-shipping-batch',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule, CommonModule ],
  templateUrl: './add-shipping-batch.component.html',
  styleUrl: './add-shipping-batch.component.scss'
})
export class AddShippingBatchComponent implements OnInit {

constructor(private route: Router) {}

  ngOnInit(): void {
    this.GetAllShippingTypes();
  }
  ShippingDate: string = new Date().toISOString().split('T')[0];
  ArriveDate: string = new Date().toISOString().split('T')[0];
  EntryDate: string = new Date().toISOString().split('T')[0];
  ShippingTypeId?: number
  CostInUSD?: number
  ShippingBatchId?: number = 0
  shippingTypes: any[] = [];
  api = inject(ApiService);
  
  GetAllShippingTypes(): void{
    this.api.getData('api/ShippingTypes').subscribe((data) =>{
      console.log(data)
      this.shippingTypes = data;
    })
  }

  AddBatch(): void{
    const payLoad = {
      'shippingBatchId':0,
      'shippingDate': this.ShippingDate,
      'arrivelDate': this.ArriveDate,
      'entryDate': this.EntryDate,
      'shippingTypeId': this.ShippingTypeId,
      'batchCostUS': this.CostInUSD
    }

    this.api.postData("api/ShippingBatch", payLoad).subscribe((res: any) => {
      if(res){}
      
    });
    
    this.route.navigate(['LangingPage/ShippingBatch'])
  }
}

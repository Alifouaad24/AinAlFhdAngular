import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { OnEndResult } from 'esbuild';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipping-batch',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule ],
  templateUrl: './shipping-batch.component.html',
  styleUrl: './shipping-batch.component.scss'
})
export class ShippingBatchComponent implements OnInit {

  constructor(private api: ApiService) {}
  ShippingBatches: any [] = [];
  ngOnInit(): void {
    this.GetAllShippingBatch();
  }

  GetAllShippingBatch(): void {
    this.api.getData('api/ShippingBatch').subscribe(res =>{
      this.ShippingBatches = res;
      console.log("this.ShippingBatches ", this.ShippingBatches);
    })
  }

  DeleteBatch(id: number): void {
    console.log("dfdrfsrg")
    this.api.deleteData(`api/ShippingBatch/${id}`);
    this.ShippingBatches = this.ShippingBatches.filter(el => el.ShippingBatchId !== id);
  }

}

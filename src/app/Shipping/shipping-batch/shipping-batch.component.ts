import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
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

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) {}
  ShippingBatches: any [] = [];

  ngOnInit(): void {
    this.GetAllShippingBatch();
    this.route.paramMap.subscribe(r => {
      this.GetAllShippingBatch();
    })
  }

  GetAllShippingBatch(): void {
    this.api.getData('api/ShippingBatch').subscribe(res =>{
      this.ShippingBatches = res;
      console.log("this.ShippingBatches ", this.ShippingBatches);
    })
  }

  DeleteBatch(id: number): void {
    console.log("dfdrfsrg", id)
    this.api.deleteData(`api/ShippingBatch/${id}`).subscribe((res: any) => {});
    this.ShippingBatches = this.ShippingBatches.filter(el => el.shippingBatchId != id);
    console.log('Updated ShippingBatches:', this.ShippingBatches);
  }

  goToAddRecipt(id: number): void{
    console.log("sss")
    this.router.navigate(['LangingPage/ShippingBatch/AddRecipt'], { queryParams: { ShippId: id } });

  }

}

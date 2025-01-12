import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
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

constructor(private route: Router, private router: ActivatedRoute) {}

  ngOnInit(): void {

    this.router.params.subscribe( params => {
      console.log("params in add is: ", params['params'])
      this.ShippingType = params['params']


    })
    this.id = +this.router.snapshot.paramMap.get('id')!;
    if(this.id){
      this.isUpdateScreen = true
      this.api.getData(`api/ShippingBatch/${this.id}`).subscribe((data) =>{
        console.log("data" , data)
        this.ShippingDate = data.shippingDate 
        ? new Date(data.shippingDate).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0];    
          this.ArriveDate = new Date(data.arrivelDate).toISOString().split('T')[0]
          this.EntryDate = new Date(data.entryDate).toISOString().split('T')[0]
          this.ShippingTypeId = data.shippingTypeId
          this.ShippingBatchId = data.shippingBatchId
          this.CostInUSD = data.batchCostUS

      })
    }
    this.GetAllShippingTypes();
  }

  ShippingType?: string
  ShippingDate: string = new Date().toISOString().split('T')[0];
  ArriveDate: string = new Date().toISOString().split('T')[0];
  EntryDate: string = new Date().toISOString().split('T')[0];
  ShippingTypeId?: number
  CostInUSD?: number
  ShippingBatchId?: number
  shippingTypes: any[] = [];
  api = inject(ApiService);
  id?: number
  isUpdateScreen: boolean = false
  
  GetAllShippingTypes(): void {
    this.api.getData('api/ShippingTypes').subscribe((data) => {
      console.log(data);
      this.shippingTypes = data;
      const matchingType = this.shippingTypes.find(el => el.description && el.description.includes("جوي"));
      this.ShippingTypeId = matchingType ? matchingType.shippingTypeId : null;
  
      console.log("this.ShippingTypeId: ", this.ShippingTypeId);
    });
  }
  

  AddBatch(): void{

    if(this.ShippingBatchId == null){
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
    else{
      const payLoad = {
        'shippingBatchId':this.ShippingBatchId,
        'shippingDate': this.ShippingDate,
        'arrivelDate': this.ArriveDate,
        'entryDate': this.EntryDate,
        'shippingTypeId': this.ShippingTypeId,
        'batchCostUS': this.CostInUSD
      }
  
      this.api.putData(`api/ShippingBatch/${this.ShippingBatchId}`, payLoad).subscribe((res: any) => {});
      
      this.route.navigate(['LangingPage/ShippingBatch'])
    }

  }
}

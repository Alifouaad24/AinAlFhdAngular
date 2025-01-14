import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { OnEndResult } from 'esbuild';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../popup/popup.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-shipping-batch',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, MatDialogModule ],
  templateUrl: './shipping-batch.component.html',
  styleUrl: './shipping-batch.component.scss'
})
export class ShippingBatchComponent implements OnInit {


  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) {}
  ShippingBatches: any [] = [];
  param: string =''
  showPopup = false;
  showPopupDeleteConfirm = false;
  selectIdForDelete?: number | undefined
  PopTitle?: string
  popDesc?: string
  ngOnInit(): void {
    this.GetAllShippingBatch();
    this.route.params.subscribe(params => {
      this.param = params['Shipping'];
      console.log("params", this.param)
      this.GetAllShippingBatch();
    })
  }

  openPopup(id: number) {
    console.log("bIIId", id)
    this.selectIdForDelete = id
    this.showPopup = true;

    this.PopTitle = "حذف سجل"
    this.popDesc = "هل تريد حذف السجل بالتأكيد ؟"
  }

  openPopup2(message: string) {
    this.showPopupDeleteConfirm = true;
    this.popDesc = message;
  }

  closePopup() {
    this.showPopup = false;
    this.showPopupDeleteConfirm = false;
  }

  GetAllShippingBatch(): void {
    this.api.getData('api/ShippingBatch').subscribe(res =>{
      this.ShippingBatches = res;
      console.log("this.ShippingBatches ", this.ShippingBatches);
    })
  }

  DeleteBatch(id: number | undefined): void {
    this.api.deleteData(`api/ShippingBatch/${id}`).subscribe((res: any) => {
      
    },
    (error) =>{
      console.log(error.error.text )
      this.openPopup2(error.error.text || error.error);
    }
  );
    this.ShippingBatches = this.ShippingBatches.filter(el => el.shippingBatchId != id);
    console.log('Updated ShippingBatches:', this.ShippingBatches);
    this.closePopup();
  }

  goToAddRecipt(id: number): void{
    console.log("sss")
    this.router.navigate(['LangingPage/ShippingBatch/AddRecipt'], { queryParams: { ShippId: id } });

  }

  goToShippTransactions(id: number){
    this.router.navigate(['LangingPage/Recipts'], {queryParams: { ShippIdToFilter: id }});
  }

}

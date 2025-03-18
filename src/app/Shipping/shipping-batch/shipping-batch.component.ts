import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { OnEndResult } from 'esbuild';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../popup/popup.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RoleService } from '../../Auth/role.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shipping-batch',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, MatDialogModule ],
  templateUrl: './shipping-batch.component.html',
  styleUrl: './shipping-batch.component.scss'
})
export class ShippingBatchComponent implements OnInit {


  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute,
    private dialog: MatDialog, private roleService: RoleService, private httpp: HttpClient) {}
  ShippingBatches: any [] = [];
  param: string =''
  showPopup = false;
  showPopupDeleteConfirm = false;
  selectIdForDelete?: number | undefined
  PopTitle?: string
  popDesc?: string

  numOfRecipts: number = 0
  totalCost: number = 0
  totalSellIQ: number = 0
  purAcc: number = 0
  totalSellDollar: number = 0 
  exchangeRate: number = 0; 


  ngOnInit(): void {
    this.getExChg()
    this.GetAllShippingBatch();
    this.route.params.subscribe(params => {
      this.param = params['Shipping'];
      this.GetAllShippingBatch();
    })
  }

  isAdmin(): boolean {
    return this.roleService.hasRole('Admin');
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
  getExChg(): void {
    this.api.getData("api/Enviroment/GetExChg").subscribe(res => {
      this.exchangeRate = res.exchangeRate;
      console.log(res)
    })
  }

  GetAllShippingBatch(): void {

    this.api.getData('api/ShippingBatch').subscribe(res =>{
      this.ShippingBatches = res;
      console.log("this.ShippingBatches ", this.ShippingBatches);
      this.numOfRecipts = 0
      this.totalCost = 0
      this.totalSellIQ = 0
      this.totalSellDollar = 0
      this.purAcc = 0
      this.ShippingBatches.map((ship) => {
        this.numOfRecipts += ship.reciptsNu
        this.totalCost += ship.batchCostUS
        this.totalSellIQ += ship.sellingIQ
    });

    this.totalSellDollar = this.totalSellIQ / this.exchangeRate
    this.purAcc = this.totalSellDollar - this.totalCost
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

    if(this.isAdmin()){
      this.router.navigate(['LangingPage/ShippingBatch/AddRecipt'], { queryParams: { ShippId: id } });
    }
  }

  goToShippTransactions(id: number){
    this.router.navigate(['LangingPage/Recipts'], {queryParams: { ShippIdToFilter: id }});
  }


  PrintPDF(id: Number): void {
    const shipId = id;
    let patch;
    let url = `http://saifsfo-002-site19.atempurl.com/api/Reciept/GeneratePdf`;
  
    if (shipId !== null && shipId !== undefined) {
      url += `/${shipId}`;
    }
  
    this.httpp.get(url, { responseType: 'blob' }).subscribe(
      (response) => {
        if (response) {
          const blob = new Blob([response], { type: 'application/pdf' });
  
          if (blob.type === 'application/pdf') {
            const urlBlob = URL.createObjectURL(blob);
  
            const link = document.createElement('a');
            link.href = urlBlob;
            link.download = 'file.pdf';
            
            link.click();
          } else {
            console.error('الاستجابة ليست مستند PDF.');
          }
        } else {
          console.error('لم يتم استلام البيانات من الخادم.');
        }
      },
      (error) => {
        console.error('حدث خطأ أثناء تحميل الـ PDF:', error);
      }
    );
  }

}

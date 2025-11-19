import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { OnEndResult } from 'esbuild';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../popup/popup.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RoleService } from '../../Auth/role.service';
import { HttpClient } from '@angular/common/http';
declare var bootstrap: any;

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
  param: number = 0
  showPopup = false;
  showPopupDeleteConfirm = false;
  selectIdForDelete?: number | undefined
  PopTitle?: string
  popDesc?: string
  receiptsToShow?: any
  numOfRecipts: number = 0
  totalCost: number = 0
  totalSellIQ: number = 0
  purAcc: number = 0
  totalSellDollar: number = 0 
  exchangeRate: number = 0; 


  ngOnInit(): void {
    this.getExChg()
    this.route.queryParams.subscribe(params => {
      if(params['ShippId']){
         this.param = +params['ShippId'];
         console.log("ShippId", this.param)
         this.GetAllShippingBatch();
      }
     
    })
  }

  ShowReceipits(id: number) {    
    this.api.getData("api/Reciept").subscribe((response: any) => {
      this.receiptsToShow = response;
      this.receiptsToShow = this.receiptsToShow.filter((r: any) => r.shippingBatchId == id)
      console.log(this.receiptsToShow);
      const modal = new bootstrap.Modal(document.getElementById('userInfoModal')!);
      modal.show();
    }, error => {
      console.error("خطأ في جلب البيانات:", error);
    });
  }


    getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const tokenData = JSON.parse(decodedPayload); 
    return tokenData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  }

  IsAdmin(): boolean {
    return this.getUserRole() === "Admin";
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

      this.ShippingBatches = this.ShippingBatches.filter((sh: any) => {
        return sh?.shippingTypeId === this.param
      })

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

    if(this.IsAdmin()){
      this.router.navigate(['LangingPage/ShippingBatch/AddRecipt'], { queryParams: { ShippId: this.param, shipDate: id } });
    }
  }

  goToShippTransactions(id: number){
    this.router.navigate(['LangingPage/Recipts'], {queryParams: { ShippIdToFilter: id , ShippId: this.param}});
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

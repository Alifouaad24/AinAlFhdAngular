import { AfterViewInit, Component, inject, NgZone } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { Receipt } from '../../Models/Recipt';
import { ActivatedRoute, NavigationEnd, Route, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { RoleService } from '../../Auth/role.service';
import { HttpClient } from '@angular/common/http';
declare var $: any;


@Component({
  selector: 'app-last-some-recipts',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './last-some-recipts.component.html',
  styleUrl: './last-some-recipts.component.scss'
  
})
export class ReciptsComponent   {


recipts: Receipt[] = [];

totalCost: number = 0;
totalLines: number = 0;
totalProfit: number = 0
shipIdToFilter?: number
profitsInIQ?: number
totalWeight: number = 0
profitsInUSD: number = 0
exChangeRate: number = 0 
totalSellUSD: number = 0
oneKGProfitInUSD: number = 0
oneKGProfitInIQ: number = 0
totalCostIQ: number = 0
pureAcc: number = 0;
currentUser: string = ""

  title = 'Ain AlFahd Company';
  http = inject(ApiService);
  httpp = inject(HttpClient);
  roleService = inject(RoleService);
  constructor(
    private route: ActivatedRoute,
    private router: Router, private zone: NgZone,  ) {

      this.getData(); 
  }
  ngOnInit(): void {
    
    this.getData();
    this.getExChg();
    this.route.queryParams.subscribe(params => {
      if (params['updated'] === 'true') {
        this.getData();
      }
  
      if (params['ShippIdToFilter']) {
        this.shipIdToFilter = +params['ShippIdToFilter']; 
        this.filterRecipts(this.shipIdToFilter);
      }
    });
  

    this.initializeDataTable();
  }
  

  ngOnDestroy() {
    if ($.fn.dataTable.isDataTable('#dataTable')) {
      $('#dataTable').DataTable().destroy();
    }
  }

  initializeDataTable() {
    if (!$.fn.dataTable.isDataTable('#dataTable')) {
      $('#dataTable').DataTable({
        paging: false,
        searching: true,
        ordering: true,
        destroy: true,
        columns: [
          { 
            data: null, 
            title: 'العمليات', 
            render: (data: any, type: any, row: { recieptId: any; }) => {
              return `
                <button class="btn btn-danger m-1" (click)="DeleteRecipt(${row.recieptId})">
                  <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-warning m-1" id="editBtn${row.recieptId}">
                  <i class="fa fa-edit"></i>
                </button>
              `;
            },
            className: 'text-center',
            visible: this.isAdmin()
          },
          { data: 'recieptDate', title: 'تاريخ الوصل', render: (data: string | number | Date) => new Date(data).toLocaleDateString('ar-IQ', { year: 'numeric', month: '2-digit', day: '2-digit' }), className: 'text-center',},
          { data: 'totalPriceFromCust', title: 'المبيع', render: (data: number | undefined) => this.divideNum(data) + ' IQ' , className: 'text-center',},
          { data: 'cost', title: 'التكلفة', render: (data: number) => data ? data.toFixed(1) + ' $' : '' , className: 'text-center',},
          { data: 'weight', title: 'الوزن', render: (data: string) => data ? data + ' Kg' : '' , className: 'text-center',},
          { 
            data: 'customer.custName', 
            title: 'اسم العميل', 
            render: (data: any) => data || 'غير معروف' , className: 'text-center',
          },
          { data: 'recieptId', title: '#', className: 'text-center', },
        ]
      });
      this.zone.run(() => {
        $('#dataTable').on('click', '.btn-danger', (event: { currentTarget: any; }) => {
          const recieptId = $(event.currentTarget).attr('id').replace('deleteBtn', '');
          this.DeleteRecipt(recieptId);
        });

        $('#dataTable').on('click', '.btn-warning', (event: { currentTarget: any; }) => {
          const recieptId = $(event.currentTarget).attr('id').replace('editBtn', '');
          this.zone.run(() => { 
            this.router.navigate([`/LangingPage/Recipts/AddRecipt/${recieptId}`]);
          });
        });
      });
    }
  }
  

  isAdmin(): boolean {
    return this.roleService.hasRole('Admin');
  }



  getData(): void {

    this.http.getData("api/Reciept").subscribe((r: Receipt[]) => {
      this.recipts = r;
      this.totalProfit = 0;
      this.totalCost = 0;
      this.totalLines = 0
      this.totalWeight = 0;
      this.totalCostIQ = 0;
      this.totalSellUSD = 0;
      this.profitsInIQ = 0;
      this.profitsInUSD = 0;
      this.oneKGProfitInUSD = 0;
      this.oneKGProfitInIQ = 0;
      this.pureAcc = 0;
      this.recipts = this.recipts.filter(el => el.shippingBatchId != null).sort((a, b) => {
        const dateA = a.recieptDate ? new Date(a.recieptDate) : new Date(0);
        const dateB = b.recieptDate ? new Date(b.recieptDate) : new Date(0);
        return dateB.getTime() - dateA.getTime(); 
      });
      // حساب القيم الإجمالية
      this.recipts.forEach(recipt => {
        this.totalProfit += recipt.totalPriceFromCust!;
        this.totalCost += recipt.cost!;
        this.totalLines++;
        this.totalWeight += recipt.weight!;
      });
  
      this.totalCostIQ = this.totalCost * this.exChangeRate;
      this.totalSellUSD = this.totalProfit / this.exChangeRate;
  
      this.profitsInIQ = this.totalProfit - this.totalCostIQ;
      this.profitsInUSD = this.totalSellUSD - this.totalCost;
      this.oneKGProfitInUSD = this.profitsInUSD / this.totalWeight;
      this.oneKGProfitInIQ = this.profitsInIQ / this.totalWeight;
  
      this.pureAcc = this.totalSellUSD - this.totalCost;
  
      if ($.fn.dataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().clear().rows.add(this.recipts).draw();
      } else {
        this.initializeDataTable();
      }
  
    });
  }
  
  getExChg(): void {
    this.http.getData("api/Enviroment/GetExChg").subscribe(res => {
      this.exChangeRate = res.exchangeRate;
    })
  }

  

  divideNum(num: number | undefined): string {
    if (num === undefined) {
      return 'N/A';
    }

    const magnitude = 1000;
    return (Math.ceil(num / magnitude) * magnitude).toLocaleString();

    // let magnitude = Math.pow(10, Math.floor(Math.log10(num) - 1));
    // let final = Math.ceil(num / magnitude) * magnitude;
    // return final.toLocaleString();
  }


  filterRecipts(id: number){

    this.http.getData("api/Reciept").subscribe((r: Receipt[]) => {
      this.recipts = r;
      this.recipts = this.recipts
    .filter(el => el.shippingBatchId == id) 
    .sort((a, b) => {
      const dateA = a.recieptDate ? new Date(a.recieptDate) : new Date(0);
      const dateB = b.recieptDate ? new Date(b.recieptDate) : new Date(0);
      return dateA.getTime() - dateB.getTime(); 
      
    });
  
    this.totalProfit = 0;
    this.totalCost = 0;
    this.totalLines = 0;
    this.totalWeight = 0;
    this.totalSellUSD = 0;
    this.totalLines = 0;
    this.totalCostIQ = 0;
    this.profitsInIQ = 0;
    this.profitsInUSD = 0;
    this.oneKGProfitInUSD = 0;
    this.oneKGProfitInIQ = 0;

    this.recipts.map(el =>{
      this.totalProfit +=  el.totalPriceFromCust!;
      this.totalCost +=  el.cost!;
      this.totalLines++;
      this.totalWeight += el.weight!;
      //this.totalSellUSD += el.sellingUSD!;
      //this.totalCostIQ += el.costIQ!;
    });

    this.totalCostIQ = this.totalCost * this.exChangeRate;
    this.totalSellUSD = this.totalProfit / this.exChangeRate;
    this.profitsInIQ = this.totalProfit - this.totalCostIQ;
    this.profitsInUSD = this.totalSellUSD - this.totalCost;
    this.oneKGProfitInUSD = this.profitsInUSD / this.totalWeight
    this.oneKGProfitInIQ = this.profitsInIQ / this.totalWeight
    this.pureAcc = this.totalSellUSD - this.totalCost;

    if ($.fn.dataTable.isDataTable('#dataTable')) {
      $('#dataTable').DataTable().clear().rows.add(this.recipts).draw();
    } else {
      this.initializeDataTable();
    }
    })
  }


  DeleteRecipt(rId: number | undefined): void {
    this.http.deleteData(`api/Reciept/${rId}`).subscribe(
      (response: any) => {
        if(response){
          this.recipts = this.recipts.filter(rec => rec.recieptId != rId)
        }
      },
    );
  }

  PrintPDF(): void {
    const shipId = this.shipIdToFilter;
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

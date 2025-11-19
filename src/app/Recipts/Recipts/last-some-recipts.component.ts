import { AfterViewInit, Component, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { Receipt } from '../../Models/Recipt';
import { ActivatedRoute, NavigationEnd, Route, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../Auth/role.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
declare var $: any;
declare var bootstrap: any;

@Component({
  selector: 'app-last-some-recipts',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './last-some-recipts.component.html',
  styleUrl: './last-some-recipts.component.scss'
  
})
export class ReciptsComponent   {


recipts: Receipt[] = [];
startDate: string = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
endDate: string = new Date().toLocaleDateString('en-CA');
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
currectShippingType?: number
ShipppIId?: number;
  title = 'Ain AlFahd Company';
  http = inject(ApiService);
  httpp = inject(HttpClient);
  roleService = inject(RoleService);
  constructor(
    private route: ActivatedRoute,
    private router: Router, private zone: NgZone, private cdr: ChangeDetectorRef  ) {

  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['ShippIdToFilter'] && params['ShippId']) {
        this.shipIdToFilter = +params['ShippIdToFilter']; 
        this.ShipppIId = +params['ShippId']
        this.filterRecipts(this.shipIdToFilter);
      }
      else if (params['updated'] === 'true') {
        this.getData();
      }
      else if (params['ShippId']) {
        this.currectShippingType = +params['ShippId']
        console.log("this.currectShippingType: ",this.currectShippingType)
        this.getData();
      }
  

    });
    this.getExChg();
    this.initializeDataTable();
  }
  

  ngOnDestroy() {
    if ($.fn.dataTable.isDataTable('#dataTable')) {
      $('#dataTable').DataTable().destroy();
    }
  }
selectedRecipt: any = null;

  initializeDataTable() {
    if (!$.fn.dataTable.isDataTable('#dataTable')) {
      $('#dataTable').DataTable({
        paging: false,
        searching: true,
        ordering: true,
        destroy: true,
        columns: [
          {
          render: (data: any, type: any, row: { recieptId: any; }) => {
            return `
              <button class="btn btn-info m-1 user-info-btn" data-id="${row.recieptId}">
                <i class="fas fa-eye"></i>
              </button>
            `;
          }},
          { 
            data: null, 
            title: 'العمليات', 
            render: (data: any, type: any, row: { recieptId: any; }) => {
              return `
                <button class="btn btn-danger m-1" id="deleteBtn${row.recieptId}" (click)="DeleteRecipt(${row.recieptId})">
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
          { data: 'recieptDate', title: 'تاريخ الوصل', render: (data: string | number | Date) => new Date(data).toLocaleDateString('en-US', { year: 'numeric', day: '2-digit', month: '2-digit' }), className: 'text-center',},
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

        $('#dataTable').on('click', '.user-info-btn', (event: any) => {
          const id = $(event.currentTarget).data('id');
          const selected = this.recipts.find(x => x.recieptId == id);
          console.log(selected)
          this.zone.run(() => {
            this.selectedRecipt = selected;
            const modal = new bootstrap.Modal(document.getElementById('userInfoModal')!);
            modal.show();
          });
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
    getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const tokenData = JSON.parse(decodedPayload); 
    return tokenData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === "Admin" || this.getUserRole() === "Sub_Admin";
  }



  getData(): void {

    this.http.getData("api/Reciept").subscribe((r: any) => {
      console.log("r: " , r)
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

      this.recipts = this.recipts.filter((receipt: any) => {
        return receipt!.shippingBatch?.shippingTypeId! === this.currectShippingType;
      });

        console.log("recipts After: ",this.recipts)


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

      const newFilter = this.recipts
        .filter(el => el.shippingBatchId == id) 
        .sort((a, b) => {
          const dateA = a.recieptDate ? new Date(a.recieptDate) : new Date(0);
          const dateB = b.recieptDate ? new Date(b.recieptDate) : new Date(0);
          return dateA.getTime() - dateB.getTime(); 
          
        });

        this.recipts = []
  
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

    this.recipts = newFilter


    this.recipts.map(el =>{
      this.totalProfit +=  el.totalPriceFromCust!;
      this.totalCost +=  el.cost!;
      this.totalLines++;
      this.totalWeight += el.weight!;
      //this.totalSellUSD += el.sellingUSD!;
      //this.totalCostIQ += el.costIQ!;
    });

    console.log("newFilter: ", newFilter)

    this.totalCostIQ = this.totalCost * this.exChangeRate;
    this.totalSellUSD = this.totalProfit / this.exChangeRate;
    this.profitsInIQ = this.totalProfit - this.totalCostIQ;
    this.profitsInUSD = this.totalSellUSD - this.totalCost;
    this.oneKGProfitInUSD = this.profitsInUSD / this.totalWeight
    this.oneKGProfitInIQ = this.profitsInIQ / this.totalWeight
    this.pureAcc = this.totalSellUSD - this.totalCost;

    if ($.fn.dataTable.isDataTable('#dataTable')) {
      $('#dataTable').DataTable().clear().rows.add(newFilter).draw();
    } else {
    }
    })
  }


  DeleteRecipt(rId: number | undefined): void {
    this.http.deleteData(`api/Reciept/${rId}`).subscribe(
      (response: any) => {
        if(response){}
      },(error =>{
       this.zone.run(() => {
        this.recipts = this.recipts.filter(rec => rec.recieptId !== rId);

      if ($.fn.dataTable.isDataTable('#dataTable')) {
        const table = $('#dataTable').DataTable();
        table.clear().rows.add(this.recipts).draw();
      }

      this.cdr.detectChanges();
      });
      })
    );
  }

  

  PrintPDF(): void {
    const shipId = this.shipIdToFilter;
    let patch;
    let url = `http://saifsfo-002-site21.atempurl.com/api/Reciept/GeneratePdf`;
  
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

  SrerchByDate(): void{

    const [year, month, day] = this.startDate.split('-').map(Number); 
    const sdate = new Date(year, month - 1, day); 
    const s = (sdate.getMonth() + 1) + '-' + sdate.getDate() + '-' + sdate.getFullYear();


    const [year1, month1, day1] = this.endDate.split('-').map(Number); 
    const edate = new Date(year1, month1 - 1, day1); 
    const e = (edate.getMonth() + 1) + '-' + edate.getDate() + '-' + edate.getFullYear();

    console.log(s)
    console.log(e)

    this.http.getData(`api/Reciept/GetBetweenPeriodDate/${s}/${e}`).subscribe((response: Receipt[]) => {
      console.log(response)

      const filterByDate = response

      filterByDate.sort((a, b) => {
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
      this.pureAcc = 0
  
      filterByDate.forEach(el =>{
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
        $('#dataTable').DataTable().clear().rows.add(filterByDate).draw();
      } 
    })
  }

  PrintPDFByDate(): void {
    const [year, month, day] = this.startDate.split('-').map(Number); 
    const sdate = new Date(year, month - 1, day); 
    const s = (sdate.getMonth() + 1) + '-' + sdate.getDate() + '-' + sdate.getFullYear();


    const [year1, month1, day1] = this.endDate.split('-').map(Number); 
    const edate = new Date(year1, month1 - 1, day1); 
    const e = (edate.getMonth() + 1) + '-' + edate.getDate() + '-' + edate.getFullYear();

    let url = `http://saifsfo-002-site21.atempurl.com/api/Reciept/GeneratePdfByDate/${s}/${e}`;
  
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

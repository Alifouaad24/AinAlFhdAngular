import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../Services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-amendment',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './amendment.component.html',
  styleUrl: './amendment.component.scss'
})
export class AmendmentComponent implements OnInit {

  /**
   *
   */
  constructor(router: Router, private route: ActivatedRoute, private toastr: ToastrService, private http: ApiService) {}


  ngOnInit(): void {
    this.GetAllAmendments();
    this.GetAllServices();
      this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.IsUpdate = true;
        this.LogId = +idParam;
        this.GetLogById(this.LogId);
      } else {
        this.route.queryParams.subscribe(queryParams => {
          const idUser = queryParams['idUser'];
          if (idUser != null) {
            this.CustomerId = idUser;
            this.GetCustomerById(this.CustomerId)
          }
        });
      }
    });
  }
  

  filteredSuggestions: string[] = [];
  filteredSuggestion: string = '';
  suggestions: string[] = [];
  res: any[] = [];
  res1: any[] = [];
  searchTerm = '';
  Services?: any
  Amendments?: any
  CustomerId: number = 0
  CustomerName?: string
  AmendmentId: number = 0
  CustomerIdId: number = 0
  InsertDate = new Date();
  IsCompleted?: boolean = false
  ServiceId: number = 0
  LogId: number = 0
  IsUpdate: boolean = false

  GetAllAmendments(): void{
    this.http.getData('api/Amendments').subscribe((res) => {
      this.Amendments = res
    })

  }

  GetCustomerById(id: number): void {
    this.http.getData(`api/Customers/GetById/${id}`).subscribe((res) => {
      this.CustomerName = res.custName;
    });
  }
  

  GetAllServices(): void{
    this.http.getData('api/ShippingTypes').subscribe((res) => {
      this.Services = res
    })
  }

  filterSuggestions(value: string): void {
    if (value.length >= 3) {
      if (/^\d/.test(value)){
        this.filteredSuggestions.pop();
        this.http.getData(`api/Customers/SearchAboutDetectedCustomerApi/${value}`).subscribe((result) => {
          this.res = result;
          this.filteredSuggestions.push(result.custName);
        })

      }else{
        this.http.getData(`api/Customers/SearchAboutCustomerApi/${value}`).subscribe((result) => {
          this.filteredSuggestions = result.map((el: any) => {
            return el.custName;
          });
        })
      }

    } else {
      this.filteredSuggestions = [];
    }
  }

  selectSuggestion(suggestion: string): void {
    this.res1 = [];
    this.searchTerm = suggestion;
    this.filteredSuggestions = [];

    this.http.getData(`api/Customers/SearchAboutCustomerApi/${suggestion}`).subscribe((result1: any) => {
      this.res1 = result1
    })
  }

  onAmendmentChange(event: any): void{
    console.log(event.target.value)

    this.AmendmentId = event.target.value;
  }

  onServiceChange(event: any): void{
    console.log(event.target.value)
    this.ServiceId = event.target.value;

  }

  SaveAmendment(): void {

    if(this.AmendmentId == 0 || this.CustomerIdId == 0 || this.ServiceId == 0){
      this.toastr.error('يرجى تعبئة الحقول المطلوبة', '')
    }
    else{
      var PayLoad = {
        'Amendment_LogId': 0,
        'AmendmentId': this.AmendmentId,
        'CustomerIdId': this.CustomerIdId,
        'InsertDate': this.InsertDate,
        'IsCompleted': this.IsCompleted,
        'ServiceId': this.ServiceId,
      }
  
      console.log(PayLoad)
  
      this.http.postData('api/AmendmentLogs', PayLoad).subscribe((response) =>{
        console.log(response)
        this.toastr.success('تم اضافة الطلب بنجاح', '')
      })
    }
  }

  GiveId(customer: any): void{
    this.CustomerName = customer.custName
    this.CustomerIdId = customer.id

    this.filteredSuggestions = [];
  }

  EditLog(id: number): void {
    var PayLoad = {
      'Amendment_LogId': this.LogId,
      'AmendmentId': this.AmendmentId,
      'CustomerIdId': this.CustomerIdId,
      'InsertDate': this.InsertDate,
      'IsCompleted': this.IsCompleted,
      'ServiceId': this.ServiceId,
    }
    this.http.putData(`api/AmendmentLogs/${id}`, PayLoad).subscribe((res) => {
      console.log(res)
    })
  }

  GetLogById(id: number): void{
    this.http.getData(`api/AmendmentLogs/${id}`).subscribe((res) => {
      console.log(res)
      this.LogId = res.amendment_LogId
      this.ServiceId = res.serviceId
      this.CustomerId = res.customerIdId
      this.IsCompleted = res.isCompleted
      this.CustomerName = res.customer.custName
      this.AmendmentId = res.amendmentId
    })
  }
}

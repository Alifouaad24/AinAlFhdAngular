import { Component, ElementRef, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Area } from '../../Models/Area';
import { City } from '../../Models/City';
import { catchError, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-search.component.html',
  styleUrl: './customer-search.component.scss'
})
export class CustomerSearchComponent implements OnInit {
  @ViewChildren('checkbox') checkboxes: QueryList<ElementRef> | undefined;

  customerForm!: FormGroup;
  areas: Area []= [];
  allAreas: Area []= [];
  cities: City []= [];
  res: any[] = [];
  res1: any[] = [];
  Merchants: any[] = [];
  searchTerm: string = '';
  filteredSuggestions: string[] = [];
  filteredSuggestion: string = '';
  suggestions: string[] = [];
  isVisible: boolean = false;
  isNumValid = true;
  isNumValid2 = true;
  selectedCityForEdit?: number;
  selectedAreaForEdit?: number;
  EditLandMark?: string;
  custId?: number;
  CustName12?: string;
  CustNun12?: string;
  updated: boolean = false
  selectedOption: string = '';
  isOrder: boolean = false
  isServices: boolean = false
  isShipping: boolean = false


  constructor(private api: ApiService, private fb: FormBuilder, private toastr: ToastrService) {}

  options = [
    { value: 'Services', label: 'تعديل خدمات' },
    { value: 'Orders', label: 'عدد الطلبات وتاريخ اخر طلب' },
    // { value: 'Shipping', label: 'عرض انواع الشحن' }
  ];

  SetView(value: string) {
    console.log('تم اختيار:', value);
    if(value == "Services"){
      this.isServices = true
      this.isOrder = false
      this.isShipping = false
    }
    else if(value == "Orders"){
      this.isServices = false
      this.isOrder = true
      this.isShipping = false
    }
    else{
      this.isServices = false
      this.isOrder = false
      this.isShipping = true
    }

  }
  ngOnInit(): void {
    this.GetAllServices()
    this.api.getData("api/Cities").subscribe(response =>{
      console.log("cities", response)
      this.cities = response;
    });
    
    this.api.getData("api/Area").subscribe(response =>{
      console.log("areas", response)
      this.areas = response
      this.allAreas = response
    });

    this.api.getData("api/MerchantAPI").subscribe(response =>{
      console.log("MerchantAPI", response)
      this.Merchants = response
    });

    this.customerForm = this.fb.group({
      merchantId: [''],
      custName: ['', [Validators.required]],
      custMob: ['', [Validators.required, Validators.pattern(/^(079|078|077)[0-9]{8}$/),
         Validators.minLength(11), Validators.maxLength(11)]],
      custCity: ['', Validators.required],
      custArea: ['', Validators.required],
      custLandMark: ['']
    });
  }

  cityChanged(event: Event): void{
    this.areas = this.allAreas
    var cityIdValue = Number((event.target as HTMLSelectElement ).value);
    console.log("cityIdValue", cityIdValue)
    this.areas = this.areas.filter(area => 
      area.cityId == cityIdValue
    )
  }

  toggleVisibility(): void {
    this.isVisible = !this.isVisible; 
  }

  AddCustomer(): void{
    if (this.customerForm?.invalid) {
      return;
    }
    const payLoad = this.customerForm?.value;
    console.log(payLoad)
    this.api.postData("api/Customers", payLoad).subscribe(response => {
      console.log(response);
    })
    this.isVisible = !this.isVisible;
  }


 filterSuggestions(value: string): void {
  if (value.length >= 3) {
    if (/^\d/.test(value)) {
      this.api.getData(`api/Customers/SearchAboutDetectedCustomerApi/${value}`).subscribe((result) => {
        this.filteredSuggestions = result.map((el: any) => el.custName);
      });
    } else {
      this.api.getData(`api/Customers/SearchAboutCustomerApi/${value}`).subscribe((result) => {
        this.filteredSuggestions = result.map((el: any) => el.custName);
      });
    }
  } else {
    this.filteredSuggestions = [];
  }
}


  selectSuggestion(suggestion: string): void {
    this.res1 = [];
    this.searchTerm = suggestion;
    this.filteredSuggestions = [];

    this.api.getData(`api/Customers/SearchAboutDetectedCustomerApi/${suggestion}`).subscribe((result1) => {
      this.res1.push(result1)
      this.CustomerId = result1.id
      this.areas = this.areas.filter(el => el.cityId === result1.custCity)
      console.log(result1)
      this.GetAllOrdersForCustomer(suggestion)
      this.GetService(result1.id)
      this.GetAllServices()
    })
  }

  EditCustData(customer: any): void {
  const payLoad = {
    'custArea': customer.custArea,
    'custCity': customer.custCity,
    'custLandmark': customer.custLandmark,
    'custName': customer.custName,
    'custMob': customer.custMob,   // تم تعديل الاسم هنا
    'merchantId': customer.merchantId
  };
  console.log(payLoad, this.custId);
  this.api.putData(`api/Customers/${customer.id}`, payLoad).subscribe(res => {});
  this.updated = true;
  setTimeout(() => {
    this.updated = !this.updated;
  }, 3000);
}



  // Get All Orders For Customer
  LastOrder?: string
  CountOfOrders?: number
  CustumerName?: number
  roles: any[] = []

  GetAllOrdersForCustomer(word: string){
    this.api.getData(`api/Customers/GetAllOrders/${word}`).subscribe((res) => {
      this.LastOrder = res.lastOrder
      this.CountOfOrders = res.count
      this.CustumerName = res.orders[0].customer.custName
    })
  }

  // Get Services For Customer

   CustomerName?: string;
   CustomerId?: number;
   idConverted?: number;
   detectRoles: any[] = [];
   selectedServices: { [key: number]: number } = {};
   
GetAllServices() {
  this.api.getData(`api/CustomerServices/GetAllServices`).subscribe((result: any[]) => {
    console.log("✅ roles:", result);
    this.roles = result; // بدل push
  });
}


   isRoleAssigned(roleId: number): boolean {
     return this.detectRoles.some(assigned => assigned.id === roleId);
   }

   GetService(id: number): void {
     this.api.getData(`api/CustomerServices/GetCustomerServices/${id}`).subscribe((result11) => {
       result11.map((e: any) => {
         this.detectRoles.push(e)
         console.log("detectRole: ",e)
       });
       this.selectedServices = {}; // ← مهم تهيئة فارغة
      result11.forEach((role: any) => {
      this.selectedServices[role.id] = role.id;
    });
     })
   }
   onCheckboxChange(roleId: number, isChecked: boolean): void {
     if (isChecked) {
       this.selectedServices[roleId] = roleId;
     } else {
       delete this.selectedServices[roleId];
     }
   }
 
 
  AddServices(): void {
  const custId = this.CustomerId;
  const payload = Object.values(this.selectedServices);

  console.log('customerId:', custId);
  console.log('Selected Service IDs:', payload);

  if (custId && custId > 0) {
    this.api.postData(`api/CustomerServices/addServicesForCustomer?custId=${custId}`, payload)
      .pipe(
        tap((response) => {
          console.log('تم الحفظ بنجاح:', response);
          this.toastr.success("تم الحفظ بنجاح")
          setTimeout(() => {
            window.location.reload()
          }, 2000);

        }),
        catchError((error) => {
          console.error('حدث خطأ أثناء الإرسال:', error);
          this.toastr.error("حدث خطأ أثناء ارسال النموذج")
          return throwError(() => error);
        })
      )
      .subscribe();

    this.selectedServices = [];
  }
}


}

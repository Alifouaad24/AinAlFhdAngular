import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Area } from '../../Models/Area';
import { City } from '../../Models/City';

@Component({
  selector: 'app-customer-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-search.component.html',
  styleUrl: './customer-search.component.scss'
})
export class CustomerSearchComponent implements OnInit {
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

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
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
      if (/^\d/.test(value)){
        this.filteredSuggestions.pop();
        this.api.getData(`api/Customers/SearchAboutDetectedCustomerApi/${value}`).subscribe((result) => {
          this.res = result;
          this.filteredSuggestions.push(result.custName);
        })

      }else{
        this.api.getData(`api/Customers/SearchAboutCustomerApi/${value}`).subscribe((result) => {
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

    this.api.getData(`api/Customers/SearchAboutDetectedCustomerApi/${suggestion}`).subscribe((result1) => {
      this.res1.push(result1)
      this.areas = this.areas.filter(el => el.cityId === result1.custCity)
      console.log(result1)
    })
  }

  EditCustData(customer: any): void {

    const payLoad = {
      'custArea': customer.custArea,
      'custCity': customer.custCity,
      'custLandmark': customer.custLandmark,
      'custName': customer.custName,
      'custNum': customer.custMob,
      'merchantId': customer.merchantId
    }
    console.log(payLoad,this.custId )
    this.api.putData(`api/Customers/${customer.id}`, payLoad).subscribe(res =>{})
    this.updated = true
    setTimeout(() => {
      this.updated = !this.updated
    }, 3000);
  }

}

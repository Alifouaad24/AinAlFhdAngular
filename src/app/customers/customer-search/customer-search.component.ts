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
  cities: City []= [];
  res: any[] = [];
  res1: any[] = [];
  searchTerm: string = '';
  filteredSuggestions: string[] = [];
  suggestions: string[] = [];
  isVisible: boolean = false;
  isNumValid = true;
  isNumValid2 = true;

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.api.getData("api/Cities").subscribe(response =>{
      this.cities = response;
    });
    
    this.api.getData("api/Area").subscribe(response =>{
      this.areas = response
    });

    this.customerForm = this.fb.group({
      CustName: ['', [Validators.required]],
      CustNum: ['', [Validators.required, Validators.pattern(/^(079|078|077)[0-9]{8}$/),
         Validators.minLength(11), Validators.maxLength(11)]],
      selectedCity: ['', Validators.required],
      selectedArea: ['', Validators.required],
      selectedLandMark: ['']
    });
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
      this.api.getData(`api/Customers/SearchAboutCustomerApi/${value}`).subscribe((result) => {
        this.filteredSuggestions = result.map((el: any) => {
          return el.custName;
        });
      })
    } else {
      this.filteredSuggestions = [];
    }
  }

  selectSuggestion(suggestion: string): void {
    this.searchTerm = suggestion;
    this.filteredSuggestions = [];

    this.api.getData(`api/Customers/SearchAboutCustomerApi/${suggestion}`).subscribe((result1) => {
      result1.map((e: any) => {
        this.res1.push(e)
      });
    })

  }

}

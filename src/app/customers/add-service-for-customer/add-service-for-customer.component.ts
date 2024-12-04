import { Component, ElementRef, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-service-for-customer',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule, CommonModule],
  templateUrl: './add-service-for-customer.component.html',
  styleUrl: './add-service-for-customer.component.scss'
})
export class AddServiceForCustomerComponent implements OnInit {

  @ViewChildren('checkbox') checkboxes: QueryList<ElementRef> | undefined;

  apiService = inject(ApiService);
  res: any[] = [];
  res1: any[] = [];
  searchTerm: string = '';
  filteredSuggestions: string[] = [];
  suggestions: string[] = [];
  CustomerName?: string;
  CustomerId?: number;
  idConverted?: number;
  roles: any[] = []
  detectRoles: any[] = [];

  ngOnInit(): void {
    this.apiService.getData(`api/CustomerServices/GetAllServices`).subscribe((result: any[]) => {
      result.map((el: any) => {
        this.roles.push(el);
      });
    })
  }

  filterSuggestions(value: string): void {
    if (value.length >= 3) {
      this.apiService.getData(`api/Customers/SearchAboutCustomerApi/${value}`).subscribe((result) => {
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
    this.res1 = [];
    this.apiService.getData(`api/Customers/SearchAboutCustomerApi/${suggestion}`).subscribe((result1) => {
      result1.map((e: any) => {
        this.res1.push(e)
      });
    })

  }

  isRoleAssigned(roleId: number): boolean {
    return this.detectRoles.some(assigned => assigned.id === roleId);
  }


  SetCustomet(name: string, id: number): void {
    this.CustomerName = name;
    this.CustomerId = id;
    this.checkboxes?.forEach((checkbox) => {
      checkbox.nativeElement.checked = false;
    });

    this.detectRoles = [];
    this.filteredSuggestions = [];

    this.GetService(id);

  }


  GetService(id: number): void {

    this.res1 = [];

    console.log("ggg");
    this.apiService.getData(`api/CustomerServices/GetCustomerServices/${id}`).subscribe((result11) => {
      result11.map((e: any) => {
        this.detectRoles.push(e)
        console.log(e)
      });
    })
  }
}

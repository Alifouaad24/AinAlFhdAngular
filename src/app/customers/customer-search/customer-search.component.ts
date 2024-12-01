import { Component, inject } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-search.component.html',
  styleUrl: './customer-search.component.scss'
})
export class CustomerSearchComponent {

  apiService = inject(ApiService);
  res: any[] = [];
  res1: any[] = [];
  searchTerm: string = '';
  filteredSuggestions: string[] = []; 
  suggestions: string[] = []; 

  filterSuggestions(value: string): void {
    if (value.length >= 3) {
       this.apiService.getData(`api/Customers/SearchAboutCustomerApi/${value}`).subscribe((result) => {
        console.log("result  " + this.res);
        this.filteredSuggestions = result.map((el: any) => {
          this.res.push(el);
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
    this.res1 = this.res;
    console.log(this.res);
  }

}

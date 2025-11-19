import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../Services/shared-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-custs-by-shipp-type',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './show-custs-by-shipp-type.component.html',
  styleUrl: './show-custs-by-shipp-type.component.scss'
})
export class ShowCustsByShippTypeComponent implements OnInit {
  customers: any[] = []
  count: number = 0
  constructor(private shd: SharedDataService) { }

  ngOnInit(): void {
    const data = this.shd.getData();
    this.customers = data.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.customer.custMob === value.customer.custMob)
    );
    this.count = this.customers.length
  }

}

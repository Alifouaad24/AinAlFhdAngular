import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './show-inventory.component.html',
  styleUrl: './show-inventory.component.scss'
})
export class ShowInventoryComponent implements OnInit {

  constructor(private http: ApiService) {}

  ItemsInventory?: any[] = []

  ngOnInit(): void {
    this.GitItemsInventory()
  }

  GitItemsInventory() {
    this.http.getData('api/Inventory').subscribe(res => {
      this.ItemsInventory = res
      console.log(`this.ItemsInventory: `, this.ItemsInventory);
    })  
  }

}

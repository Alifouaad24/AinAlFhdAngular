import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fix-she-in-codes',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, FormsModule ],
  templateUrl: './fix-she-in-codes.component.html',
  styleUrl: './fix-she-in-codes.component.scss'
})
export class FixSheInCodesComponent {

  constructor(private http: ApiService) {}
  today?: string;
  orders?: any
  isLoading = false;

  ngOnInit() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    this.today = `${year}-${month}-${day}`;
  }


  search() {
    this.isLoading = true
    this.http.getData(`api/OrderAPI/SearchAboutOrderByDate/${this.today}`).subscribe((response) => {
      this.orders = response
      console.log(this.orders)
      this.isLoading = false

    })
  }

  fixSheInCode(order: any, newCodeInput: HTMLInputElement) {

    const newSKU = newCodeInput.value;

    if(newSKU != null && newSKU != ""){
      this.http.postData(`api/OrderAPI/${order.item.id}/${newSKU}`, {}).subscribe((response) => {
        order.item.pCode = response.pcCode
        order.item.oldCode = response.olldCode
        newCodeInput.value = '';
      })
    }
  }
}

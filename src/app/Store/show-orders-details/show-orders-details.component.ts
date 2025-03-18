import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { InfiniteScrollDirective  } from 'ngx-infinite-scroll'; 
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-show-orders-details',
  standalone: true,
  templateUrl: './show-orders-details.component.html',
  styleUrls: ['./show-orders-details.component.scss'],
  imports: [InfiniteScrollDirective , RouterLink, RouterOutlet, CommonModule],
})
export class ShowOrdersDetailsComponent implements OnInit {
  OrderDetails: any[] = [];
  pageNumber: number = 0;
  pageSize: number = 20;
  scrollDistance: number = 1;
  scrollUpDistance: number = 2;
  scrollThreshold: number = 10;
  isUpdated: boolean = false
  selectedOrderId?: number | undefined
  modal?: any
  constructor(private http: ApiService, private router: Router, private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.loadData();
    this.route.queryParams.subscribe(params => {
      if (params['updated'] === 'true') {
        this.isUpdated = !this.isUpdated
        setTimeout(() => {
          this.isUpdated = !this.isUpdated
        }, 2000)
        this.loadData();
      }
    });
  }

  openModal(id: number | undefined) {
    console.log(id)
    this.selectedOrderId = id;
     this.modal = new bootstrap.Modal(document.getElementById('myModal'));
     this.modal.show();
  }

  loadData(): void {
    this.pageNumber++;
    this.http.getData(`api/OrderDetails/${this.pageNumber}/${this.pageSize}`).subscribe((response: any) => {
      console.log(response);
      if (response && response.data) {
        this.OrderDetails = [...this.OrderDetails, ...response.data];
      }
    });
  }
  

  GoToEditPage(id: number): void {
    this.router.navigate([`LangingPage/AddItemToStore/${id}`]);
  }


  HidePopup(): void {
    const modalElement = document.getElementById('myModal');
    if (modalElement) {
      this.modal = bootstrap.Modal.getInstance(modalElement);
      if (this.modal) {
        this.modal.hide();
      }
    }
  }
  

  deleteOrderDetails(id: number): void {
    console.log(id)
    this.http.deleteData(`api/OrderDetails/${id}`).subscribe((response: any) => {
      console.log(response);
      this.OrderDetails = this.OrderDetails.filter((or) => or.id !== id);
    });

    const modalElement = document.getElementById('myModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modal.hide();
    }
  }
}

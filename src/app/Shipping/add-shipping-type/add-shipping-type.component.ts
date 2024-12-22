import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-shipping-type',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, FormsModule ],
  templateUrl: './add-shipping-type.component.html',
  styleUrl: './add-shipping-type.component.scss'
})
export class AddShippingTypeComponent implements OnInit {
  Description: string = "";
  shippingTypeId: number | null = null;
  isAdd: boolean = false
  constructor(private router: Router, private route: ActivatedRoute,) {}

  ngOnInit(): void {
    this.shippingTypeId = +this.route.snapshot.paramMap.get('id')!;
    if (this.shippingTypeId) {
      this.GetShippingType(this.shippingTypeId);
      this.isAdd = this.shippingTypeId !== null;
    }
  }
  api = inject(ApiService)

  AddShippingType(): void{
    const payload = {
      description: this.Description
    };
    if (this.shippingTypeId) {
      this.api.putData(`api/ShippingTypes/${this.shippingTypeId}`, payload).subscribe(res => {
        console.log(res);
      });
    } else {
      this.api.postData('api/ShippingTypes', payload).subscribe(res => {
        console.log(res);
      });
    }
    this.Description = "";
    this.router.navigate(['/ShippingTypes'], { queryParams: { updated: 'true' } });
  }

  GetShippingType(id: number): void{
   this.api.getData(`api/ShippingTypes/${id}`).subscribe(res => {
      console.log(res)
      this.Description = res.description;
    });
  }
} 

import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipping-types',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './shipping-types.component.html',
  styleUrl: './shipping-types.component.scss'
})
export class ShippingTypesComponent implements OnInit {
  
  constructor(private route: ActivatedRoute) {}
  SippingTypes: any[] = [];
  api = inject(ApiService);

  ngOnInit(): void {
    this.GetAllShippingTypes();
    this.route.queryParams.subscribe(params => {
      if (params['updated'] === 'true') {
        this.GetAllShippingTypes();
      }
    });
  }

  GetAllShippingTypes(): void{
    this.api.getData('api/ShippingTypes').subscribe((data) =>{
      this.SippingTypes = data;
    })
  }

  DeleteType(id: number): void{
    this.api.deleteData(`api/ShippingTypes/${id}`).subscribe((data) =>{
    })
    this.SippingTypes = this.SippingTypes.filter(ship => ship.shippingTypeId !== id);
  }

}

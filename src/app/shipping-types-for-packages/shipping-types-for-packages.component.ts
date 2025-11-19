import { Component, inject } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { RoleService } from '../Auth/role.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { DecodeTokenService } from '../Services/decode-token.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shipping-types-for-packages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './shipping-types-for-packages.component.html',
  styleUrl: './shipping-types-for-packages.component.scss'
})
export class ShippingTypesForPackagesComponent {
  title = 'Ain AlFahd Company';
  http = inject(ApiService);
  roleService = inject(RoleService);
  router = inject(Router);
  decodeToken = inject(DecodeTokenService)
  Routes: any = null;
  SubRoutes: any[] = [];

  constructor(private route: ActivatedRoute) { }

  GetAllShippingTypes() {
    this.http.getData(`api/ShippingTypes`).subscribe((res: any[]) => {
      console.log(res)
      this.SubRoutes = res

    });
  }


  ngOnInit(): void {
    this.GetAllShippingTypes()
  }
}

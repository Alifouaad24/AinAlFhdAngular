import { Component, inject } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { RoleService } from '../Auth/role.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { DecodeTokenService } from '../Services/decode-token.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-shipping-types-for-navigate',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './show-shipping-types-for-navigate.component.html',
  styleUrl: './show-shipping-types-for-navigate.component.scss'
})
export class ShowShippingTypesForNavigateComponent {
  title = 'Ain AlFahd Company';
  http = inject(ApiService);
  roleService = inject(RoleService);
  router = inject(Router);
  decodeToken = inject(DecodeTokenService)
  Routes: any = null;
  SubRoutes: any[] = [];

constructor(private route: ActivatedRoute) {
  let id: number = 0; 

  this.route.queryParams.subscribe(params => {
    id = +params['id'] || 0; 
    this.GetSystems(id);
  });
}

GetAllShippingTypes() {
  this.http.getData(`api/ShippingTypes`).subscribe((res: any[]) => {
        console.log(res)
      });
}


  GetSystems(id: number) {
  this.http.getData(`api/System/GetAllSystemsByMainSys/${id}`).subscribe((res: any[]) => {
        this.SubRoutes.push(...res);
        const dynamicRoutes = res
          .filter(route => route.routingName) 
          .map((route: any) => ({
            path: route.routingName,
            loadComponent: () => this.getComponentByPath(route.routingName)
          }));

        const currentRoutes = this.router.config;
        const landingPageRoute1 = currentRoutes.find(r => r.path === 'LangingPage');
        if (landingPageRoute1 && landingPageRoute1.children) {
          
          landingPageRoute1.children.push(...dynamicRoutes);
        }
      });
}



  async getComponentByPath(path: string): Promise<any> {
  switch (path) {
      case 'AirShipp':
      const { AirShippingMenuComponent } = await import('../air-shipping-menu/air-shipping-menu.component');
      return AirShippingMenuComponent;

      case 'LandShipp':
      const { LandShippingComponent } = await import('../land-shipping/land-shipping.component');
      return LandShippingComponent;

      //       case 'SeaShipp':
      // const { AddItemToStoreComponent } = await import('../Store/add-item-to-store/add-item-to-store.component');
      // return AddItemToStoreComponent;

    default:
      throw new Error(`No component found for path: ${path}`);
  }
}


  ngOnInit(): void {
    this.GetAllShippingTypes()
  }

}

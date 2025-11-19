import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { Router, RouteReuseStrategy, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ApiService } from '../Services/api.service';
import { Receipt } from '../Models/Recipt';
import { RoleService } from '../Auth/role.service';
import { DecodeTokenService } from '../Services/decode-token.service';


@Component({
  selector: 'app-langing-page',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, RouterModule],
  templateUrl: './langing-page.component.html',
  styleUrl: './langing-page.component.scss'
})
export class LangingPageComponent {

  title = 'Ain AlFahd Company';
  http = inject(ApiService);
  roleService = inject(RoleService);
  router = inject(Router);
  decodeToken = inject(DecodeTokenService)

  constructor() { }

  hasShippingSubcategory(parentId: number): boolean {
    return this.SubRoutes.some(sub => sub.sub_category_id === parentId && sub.name.includes('شحن'));
  }

  hasCustomerSubcategory(parentId: number): boolean {
    return this.SubRoutes.some(sub => sub.sub_category_id === parentId && sub.name.includes('زبائن'));
  }

  getShippingSubId(parentId: number): number | null {
    const match = this.SubRoutes.find(sub => sub.sub_category_id === parentId && sub.name.includes('شحن'));
    return match ? match.id : null;
  }

  getCustomerSubId(parentId: number): number | null {
    const match = this.SubRoutes.find(sub => sub.sub_category_id === parentId && sub.name.includes('زبائن'));
    return match ? match.id : null;
  }


  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const tokenData = JSON.parse(decodedPayload);
    return tokenData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  }

  GetCurrentUser(): void {
    const token = localStorage.getItem('token');
    const payload = token!.split('.')[1];
    const decodedPayload = atob(payload);
    const tokenData = JSON.parse(decodedPayload);
    var userName = tokenData['unique_name'];
    this.http.getData(`api/Account/${userName}`).subscribe((r: Receipt[]) => {
      this.currentUser = r;
    })
  }

  isAdmin: boolean = false
  recipts: Receipt[] = [];
  selectSideBar: string = '';
  env: string = ''
  activeButton = ''
  currentUser: any = null;
  isSidebarOpen = false;
  Routes: any = null;
  SubRoutes: any[] = [];

  getData(): void {
    this.http.getData("api/Reciept/GetLastFiveRecords").subscribe((r: Receipt[]) => {
      this.recipts = r;
      console.log(r)
    })
  }

  showSideBar(selectSide: string): void {
    this.selectSideBar = selectSide;
    this.activeButton = selectSide
  }




  GetSystems() {
    this.http.getData("api/System/GetAllSystemsForAinAlFhd").subscribe(res => {
      this.Routes = res;
      console.log(this.Routes);

      const dynamicRoutes = this.Routes.map((route: any) => ({
        path: route.routingName,
        loadComponent: () => this.getComponentByPath(route.routingName)
      }));

      const currentConfig = this.router.config;
      const landingPageRoute = currentConfig.find(r => r.path === 'LangingPage');
      if (landingPageRoute && landingPageRoute.children) {
        landingPageRoute.children.push(...dynamicRoutes);
      }

      this.router.resetConfig(currentConfig);

      this.SubRoutes = [];

      this.Routes.forEach((el: any) => {
        this.http.getData(`api/System/GetAllSystemsByMainSys/${el.id}`).subscribe((res: any[]) => {
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
      });
      console.log("SubRoutes", this.SubRoutes)

    });
  }



  async getComponentByPath(path: string): Promise<any> {
    switch (path) {
      case 'Store':
        const { StoreComponent } = await import('../AinAlFhd/store/store.component');
        return StoreComponent;

      case 'CustomerServicesFromDB':
        const { CustomerServicesComponent } = await import('../AinAlFhd/customer-services/customer-services.component');
        return CustomerServicesComponent;

      case 'Services':
        const { ServicesComponent } = await import('../AinAlFhd/services/services.component');
        return ServicesComponent;

      case 'Seals':
        const { SealesComponent } = await import('../AinAlFhd/seales/seales.component');
        return SealesComponent;

      case 'SearchCustomer':
        const { CustomerSearchComponent } = await import('../customers/customer-search/customer-search.component');
        return CustomerSearchComponent;

      case 'Customers':
        const { CustomersComponent } = await import('../customers/customers.component');
        return CustomersComponent;

      case 'AddSheInProduct':
        const { AddItemToStoreComponent } = await import('../Store/add-item-to-store/add-item-to-store.component');
        return AddItemToStoreComponent;

      case 'myStore':
        const { ShowInventoryComponent } = await import('../Store/show-inventory/show-inventory.component');
        return ShowInventoryComponent;

      case 'ShippingTypesNew':
        const { ShowShippingTypesForNavigateComponent } = await import('../show-shipping-types-for-navigate/show-shipping-types-for-navigate.component');
        return ShowShippingTypesForNavigateComponent;


      case 'sheinIraq':
        const { FixSheInCodesComponent } = await import('../Store/fix-she-in-codes/fix-she-in-codes.component');
        return FixSheInCodesComponent;

      default:
        throw new Error(`No component found for path: ${path}`);
    }
  }


  ngOnInit(): void {
    this.GetSystems()
    this.getData();
    this.http.getData("api/Enviroment").subscribe(res => {
      this.env = res.db_env;
    })
    this.GetCurrentUser()
    var x = this.IsAdmin();
  }

  IsAdmin(): boolean {
    return this.getUserRole() === "Admin" || this.getUserRole() === "Sub_Admin";
  }

  IsSuper_Admin(): boolean {
    return this.getUserRole() === "Admin";
  }

  logout() {
    localStorage.removeItem('token')
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  divideNum(num: number | undefined): string {
    if (num === undefined) {
      return 'N/A';
    }
    let magnitude = Math.pow(10, Math.floor(Math.log10(num) - 1));
    let final = Math.ceil(num / magnitude) * magnitude;
    return final.toLocaleString();
  }



  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    const sidebar = document.getElementById('accordionSidebar');
    if (this.isSidebarOpen) {
      sidebar?.classList.add('toggled');
    } else {
      sidebar?.classList.remove('toggled');
    }
  }

}

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

  constructor() {}

  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const tokenData = JSON.parse(decodedPayload); 
    return tokenData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  }

  GetCurrentUser(): void{
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
  selectSideBar: string ='';
  env: string = ''
  activeButton = ''
  currentUser: any = null;
  isSidebarOpen = false;
  
  getData(): void {
    this.http.getData("api/Reciept/GetLastFiveRecords").subscribe((r: Receipt[]) => {
      this.recipts = r;
      console.log(r)
    })
  }

  showSideBar(selectSide: string): void{
    this.selectSideBar = selectSide;
    this.activeButton = selectSide
  }

  ngOnInit(): void {
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

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

  //constructor(private roleService: RoleService) {}
  // getUserRole(): string | null {
  //   const token = localStorage.getItem('token'); // أو من أي مكان حافظ فيه التوكن
  //   if (!token) return null;
  
  //   const payload = token.split('.')[1];  // ناخذ الجزء الثاني من التوكن
  //   const decodedPayload = atob(payload); // نفك تشفير Base64
  //   const tokenData = JSON.parse(decodedPayload); // نحول JSON
  
  //   return tokenData['role'] || null;  // نرجع قيمة role
  // }

  /**
   *
   */
  constructor() {
    this.isAdmin = this.decodeToken.isInRole('Admin');
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
    
    this.currentUser = this.roleService.getCurrentUser()

    this.selectSideBar = this.IsAdmin() ?  "MainScreen" : ""
  }

  IsAdmin(): boolean {
    return this.roleService.hasRole('Admin');
  }

  logout() {
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

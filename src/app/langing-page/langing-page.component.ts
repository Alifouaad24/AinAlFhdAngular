import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { Router, RouteReuseStrategy, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ApiService } from '../Services/api.service';
import { Receipt } from '../Models/Recipt';
import { RoleService } from '../Auth/role.service';

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

  //constructor(private roleService: RoleService) {}

  recipts: Receipt[] = [];
  isCollapsedMain = false;
  isCollapsedAir = false;
  selectSideBar: string ='';
  env: string = ''
  activeButton = ''
  currentUser: any = null;

  
  toggleCollapse(type: string) {

    switch (type){
      case 'main' :{
        this.isCollapsedMain = !this.isCollapsedMain;
        this.isCollapsedAir = false
        break;
      }
      case 'air' :{
        this.isCollapsedAir = !this.isCollapsedAir;
        this.isCollapsedMain = false
        break;
      }
      
    }
    }
  
  // toggleSidebar() {
  //   this.isCollapsed = !this.isCollapsed;
  // }
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

  logout(): void {
    this.roleService.logout();
    this.router.navigate(['/login'])
  }

  divideNum(num: number | undefined): string {
    if (num === undefined) {
      return 'N/A';
    }
    let magnitude = Math.pow(10, Math.floor(Math.log10(num) - 1));
    let final = Math.ceil(num / magnitude) * magnitude;
    return final.toLocaleString();
  }

}

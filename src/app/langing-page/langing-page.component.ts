import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ApiService } from '../Services/api.service';
import { Receipt } from '../Models/Recipt';

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

  recipts: Receipt[] = [];
  isCollapsed = false;
  selectSideBar: string ='MainScreen';
  env: string = ''
  activeButton = ''
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
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

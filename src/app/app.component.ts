import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ApiService } from './Services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { User, Address, Geo, Company } from './Models/User';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule],
  providers:[ApiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'AngularAinAlfahdNew';
  http = inject(ApiService);

  Users!: User[];

  getData(): void{
    console.log(this.title);
    this.http.getData("users").subscribe((r) => {
      this.Users = r;
      console.log(r[0]);
    })
  }

  ngOnInit(): void {
    this.getData();
  }

  addUser(): void{
    console.log("r[0]");
  }

}

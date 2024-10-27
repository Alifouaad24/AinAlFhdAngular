import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Ain';
  name = 'Ali F alali';

  firstMethod(): void{
    console.log(this.title + " For Test")
  }
}

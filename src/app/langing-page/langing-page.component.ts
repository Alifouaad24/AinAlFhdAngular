import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-langing-page',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './langing-page.component.html',
  styleUrl: './langing-page.component.scss'
})
export class LangingPageComponent {

  title: string = "Ain AlFhd Company";

}

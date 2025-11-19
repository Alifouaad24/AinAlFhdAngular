import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent {

}

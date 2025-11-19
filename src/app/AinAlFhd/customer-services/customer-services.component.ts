import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customer-services',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './customer-services.component.html',
  styleUrl: './customer-services.component.scss'
})
export class CustomerServicesComponent {

}

import { Routes } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { CustomersComponent } from './customers/customers.component';

export const routes: Routes = [
    {
        path: "Orders",
        component: OrdersComponent
    },
    {
        path: "Customers",
        component: CustomersComponent
    }
];

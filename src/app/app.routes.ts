import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerSearchComponent } from './customers/customer-search/customer-search.component';

export const routes: Routes = [
    {
        path: "Orders",
        component: OrdersComponent
    },
    {
        path: "Customers",
        component: CustomersComponent
    },
    {
        path: "SearchCustomer",
        component: CustomerSearchComponent
    }
];

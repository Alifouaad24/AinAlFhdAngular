import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerSearchComponent } from './customers/customer-search/customer-search.component';
import { LastSomeReciptsComponent } from './Recipts/last-some-recipts/last-some-recipts.component';

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
    },
    {
        path: "last5recipts",
        component: LastSomeReciptsComponent
    }
];

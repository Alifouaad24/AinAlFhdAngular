import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerSearchComponent } from './customers/customer-search/customer-search.component';
import { LastSomeReciptsComponent } from './Recipts/last-some-recipts/last-some-recipts.component';
import { LangingPageComponent } from './langing-page/langing-page.component';
import { AddServiceForCustomerComponent } from './customers/add-service-for-customer/add-service-for-customer.component';

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
        path: 'last5recipts',
        component: LastSomeReciptsComponent
    },
    {
        path: '',
        component: LangingPageComponent
    },
    {
        path: 'AddServiceForCustomer',
        component: AddServiceForCustomerComponent
    }
];

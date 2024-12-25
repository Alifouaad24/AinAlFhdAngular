import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerSearchComponent } from './customers/customer-search/customer-search.component';
import { LastSomeReciptsComponent } from './Recipts/last-some-recipts/last-some-recipts.component';
import { LangingPageComponent } from './langing-page/langing-page.component';
import { AddServiceForCustomerComponent } from './customers/add-service-for-customer/add-service-for-customer.component';
import { ShippingTypesComponent } from './Shipping/shipping-types/shipping-types.component';
import { Address } from './Models/User';
import { AddShippingTypeComponent } from './Shipping/add-shipping-type/add-shipping-type.component';
import { ShippingBatchComponent } from './Shipping/shipping-batch/shipping-batch.component';
import { AddShippingBatchComponent } from './Shipping/add-shipping-batch/add-shipping-batch.component';
import { LogInComponent } from './Accounts/log-in/log-in.component';

export const routes: Routes = [
    {
        path: "Orders",
        component: OrdersComponent
    },
    {
        path: 'LangingPage',
        component: LangingPageComponent,
        children: [
          { path: 'last5recipts', component: LastSomeReciptsComponent },
          { path: 'ShippingTypes', component: ShippingTypesComponent },
          { path: 'ShippingBatch', component: ShippingBatchComponent },
          {
            path: "Customers",
            component: CustomersComponent
        },
        {
            path: "SearchCustomer",
            component: CustomerSearchComponent
        },
        {
            path: 'AddServiceForCustomer',
            component: AddServiceForCustomerComponent
        },
        {
            path: 'AddUpdateShippingTypes/:id',
            component: AddShippingTypeComponent
        },
        {
            path: 'AddUpdateShippingTypes',
            component: AddShippingTypeComponent
        },
        {
            path: 'AddUpdateShippingBatch',
            component: AddShippingBatchComponent
        },
        {
            path: 'AddUpdateShippingBatch/:id',
            component: AddShippingBatchComponent
        },
        ],
    },
    { path: 'login', component: LogInComponent }, 
    { path: '', redirectTo: 'login', pathMatch: 'full' }, 
    { path: '**', redirectTo: 'login' },
];

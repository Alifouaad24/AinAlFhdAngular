import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerSearchComponent } from './customers/customer-search/customer-search.component';
import { ReciptsComponent } from './Recipts/Recipts/last-some-recipts.component';
import { LangingPageComponent } from './langing-page/langing-page.component';
import { AddServiceForCustomerComponent } from './customers/add-service-for-customer/add-service-for-customer.component';
import { ShippingTypesComponent } from './Shipping/shipping-types/shipping-types.component';
import { Address } from './Models/User';
import { AddShippingTypeComponent } from './Shipping/add-shipping-type/add-shipping-type.component';
import { ShippingBatchComponent } from './Shipping/shipping-batch/shipping-batch.component';
import { AddShippingBatchComponent } from './Shipping/add-shipping-batch/add-shipping-batch.component';
import { LogInComponent } from './Accounts/log-in/log-in.component';
import { AddReciptComponent } from './Recipts/add-recipt/add-recipt.component';
import { MainScreenForMaimComponent } from './MainScreens/main-screen-for-maim/main-screen-for-maim.component';
import { MainScreenForAirComponent } from './MainScreens/main-screen-for-air/main-screen-for-air.component';
import { MainScreenForseaComponent } from './MainScreens/main-screen-forsea/main-screen-forsea.component';
import { MainScreenForDelevaryComponent } from './MainScreens/main-screen-for-delevary/main-screen-for-delevary.component';
import { MainScreenForStoreComponent } from './MainScreens/main-screen-for-store/main-screen-for-store.component';

export const routes: Routes = [
    {
        path: "Orders",
        component: OrdersComponent
    },
    {
        path: 'LangingPage',
        component: LangingPageComponent,
        children: [
          { path: 'Recipts', component: ReciptsComponent},
          { path: 'ShippingBatch/AddRecipt', component: AddReciptComponent},
          { path: 'Recipts/AddRecipt/:id', component: AddReciptComponent},
          { path: 'ShippingTypes', component: ShippingTypesComponent },
          { path: 'ShippingBatch', component: ShippingBatchComponent },

          { path: 'MainScreenForMain', component: MainScreenForMaimComponent },
          { path: 'MainScreenForAir', component: MainScreenForAirComponent },
          { path: 'MainScreenForSea', component: MainScreenForseaComponent },
          { path: 'MainScreenForDelevary', component: MainScreenForDelevaryComponent },
          { path: 'MainScreenForStore', component: MainScreenForStoreComponent },
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
            path: 'ShippingBatch/AddUpdateShippingBatch',
            component: AddShippingBatchComponent
        },
        {
            path: 'ShippingBatch/AddUpdateShippingBatch/:id',
            component: AddShippingBatchComponent
        },
        ],
    },
    { path: 'login', component: LogInComponent }, 
    { path: '', redirectTo: 'login', pathMatch: 'full' }, 
    { path: '**', redirectTo: 'login' },
];

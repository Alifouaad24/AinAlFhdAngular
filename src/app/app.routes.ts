import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FirstComponent } from './first/first.component';

export const routes: Routes = [
    {
        path: 'first',
        component: FirstComponent,
    },
    {
        path: '',
        component: AppComponent,
    },
];

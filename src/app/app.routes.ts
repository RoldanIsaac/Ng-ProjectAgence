import { Routes } from '@angular/router';
import { BasicLayoutComponent } from './layout/layouts/basic-layout/basic-layout.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app/home',
  },
  {
    path: 'app/home',
    component: BasicLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/modules.routes').then((m) => m.routes),
      },
    ],
  },
];

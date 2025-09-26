import { Routes } from '@angular/router';
import { AgenceComponent } from './agence/views/agence/agence.component';
import { UsuarioComponent } from './usuário/views/usuario/usuario.component';
import { ProjetosComponent } from './projetos/views/projetos/projetos.component';
import { AdministrativoComponent } from './administrativo/views/administrativo/administrativo.component';
import { ComercialComponent } from './comercial/views/comercial/comercial.component';
import { FinanceiroComponent } from './financeiro/views/financeiro/financeiro.component';
import { DashboardComponent } from '../views/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'agence',
    component: AgenceComponent,
  },
  {
    path: 'projetos',
    component: ProjetosComponent,
  },
  {
    path: 'administrativo',
    component: AdministrativoComponent,
  },
  {
    path: 'comercial',
    component: ComercialComponent,
  },
  {
    path: 'financeiro',
    component: FinanceiroComponent,
  },
  {
    path: 'usuario',
    component: UsuarioComponent,
  },
];

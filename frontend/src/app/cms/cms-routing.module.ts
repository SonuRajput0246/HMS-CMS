import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../core/auth.guard';
import { CmsDashboardComponent } from './dashboard/cms-dashboard.component';
import { PosScreenComponent } from './pos/pos-screen.component';
import { KdsScreenComponent } from './kds/kds-screen.component';
import { TableListComponent } from './tables/table-list.component';
import { OrderListComponent } from './orders/order-list.component';
import { CustomerListComponent } from './customers/customer-list.component';
import { RecipeListComponent } from './recipes/recipe-list.component';
import { ReportScreenComponent } from './reports/report-screen.component';

/**
 * CMS routes.
 *
 * `menuId` values are the module ids from the CMS module seeder
 * (src/database/seeders/module_seeder_cms.py). AuthGuard reads them off
 * route.data and checks the signed-in user's menu_access, so a role without
 * TABLE access cannot reach /cms/tables even by typing the URL.
 *
 * POS and KDS are routed outside the dashboard shell on purpose: both are
 * full-bleed screens that a cashier and a chef use continuously, and the
 * breadcrumb + tab chrome would eat vertical space they need.
 */
const routes: Routes = [
  {
    path: 'dashboard',
    component: CmsDashboardComponent,
    canActivate: [AuthGuard],
    data: { menuId: 1, breadcrumb: 'Dashboard' }
  },

  // ---- operational screens, no shell chrome ---------------------------
  {
    path: 'pos',
    component: PosScreenComponent,
    canActivate: [AuthGuard],
    data: { menuId: 7, breadcrumb: 'POS / Billing' }
  },
  {
    path: 'kds',
    component: KdsScreenComponent,
    canActivate: [AuthGuard],
    data: { menuId: 6, breadcrumb: 'Kitchen Display' }
  },

  // ---- admin screens, wrapped in the breadcrumb shell -----------------
  {
    path: 'tables',
    component: TableListComponent,
    canActivate: [AuthGuard],
    data: { menuId: 3, breadcrumb: 'Table Management' }
  },
  {
    path: 'orders',
    component: OrderListComponent,
    canActivate: [AuthGuard],
    data: { menuId: 4, breadcrumb: 'Order Management' }
  },
  {
    path: 'customers',
    component: CustomerListComponent,
    canActivate: [AuthGuard],
    data: { menuId: 5, breadcrumb: 'Customer Management' }
  },
  {
    path: 'recipes',
    component: RecipeListComponent,
    canActivate: [AuthGuard],
    data: { menuId: 12, breadcrumb: 'Menu & Recipes' }
  },
  {
    path: 'reports',
    component: ReportScreenComponent,
    canActivate: [AuthGuard],
    data: { menuId: 1, breadcrumb: 'Reports' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
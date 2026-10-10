import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { ListCategoryComponent } from './list-category/list-category.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ListInventoryComponent } from './list-inventory/list-inventory.component';
import { ManageInventoryComponent } from './manage-inventory/manage-inventory.component';
import { InventoryDashboardComponent } from './inventory-dashboard/inventory-dashboard.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    ListCategoryComponent,
    ManageCategoryComponent,
    ListInventoryComponent,
    ManageInventoryComponent,
    InventoryDashboardComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule
  ]
})
export class InventoryModule { }

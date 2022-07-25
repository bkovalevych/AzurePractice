import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardIndexComponent } from './dashboard-index/dashboard-index.component';
import { DashboardWalletsComponent } from './dashboard-wallets/dashboard-wallets.component';
import { CreateTransactionDialogComponent } from './create-transaction-dialog/create-transaction-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown'
import { InputNumberModule } from 'primeng/inputnumber'
import { InputTextModule } from 'primeng/inputtext'

@NgModule({
  declarations: [
    DashboardIndexComponent,
    DashboardWalletsComponent,
    CreateTransactionDialogComponent
  ],
  imports: [
    DropdownModule,
    DialogModule,
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    InputNumberModule,
    InputTextModule
  ]
})
export class DashboardModule { }

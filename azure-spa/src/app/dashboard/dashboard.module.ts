import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardIndexComponent } from './dashboard-index/dashboard-index.component';
import { DashboardWalletsComponent } from './dashboard-wallets/dashboard-wallets.component';
import { CreateTransactionDialogComponent } from './create-transaction-dialog/create-transaction-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
import { DashboardChartsComponent } from './dashboard-charts/dashboard-charts.component';
import { TabViewModule } from 'primeng/tabview';
import { CarouselModule } from 'primeng/carousel';

@NgModule({
  declarations: [
    DashboardIndexComponent,
    DashboardWalletsComponent,
    CreateTransactionDialogComponent,
    DashboardChartsComponent
  ],
  imports: [
    DropdownModule,
    DialogModule,
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    InputNumberModule,
    InputTextModule,
    ChartModule,
    TabViewModule,
    CarouselModule
  ]
})
export class DashboardModule { }

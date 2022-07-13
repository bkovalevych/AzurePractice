import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  {
    path: '', pathMatch: 'full',
    loadChildren: () => import("./home/home.module").then(it => it.HomeModule),
  },
  {
    path: 'profile',
    canLoad: [MsalGuard],
    loadChildren: () => import("./profile/profile.module").then(it => it.ProfileModule),
  },
  {
    path: 'dashboard',
    canLoad: [MsalGuard],
    loadChildren: () => import("./dashboard/dashboard.module").then(it => it.DashboardModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

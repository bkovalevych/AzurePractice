import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './core/services/guards/auth-guard.service';

const routes: Routes = [
  {
    path: '', pathMatch: 'full',
    loadChildren: () => import("./home/home.module").then(it => it.HomeModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

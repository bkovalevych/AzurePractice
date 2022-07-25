import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileIndexComponent } from './profile-index/profile-index.component';
import { SharedModule } from '../shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import {InplaceModule} from 'primeng/inplace';


@NgModule({
  declarations: [
    ProfileIndexComponent
  ],
  imports: [
    InplaceModule,
    CommonModule,
    SharedModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }

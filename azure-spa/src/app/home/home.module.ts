import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HomeIndexComponent } from './home-index/home-index.component';
import { ListboxModule } from 'primeng/listbox'
import { BadgeModule } from 'primeng/badge'
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { SlideMenuModule } from 'primeng/slidemenu';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { DialogModule } from 'primeng/dialog'
import { AutoCompleteModule } from 'primeng/autocomplete'
import { CreateChatComponent } from './overlays/create-chat/create-chat.component'

@NgModule({
  declarations: [
    HomeIndexComponent,
    CreateChatComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    ListboxModule,
    BadgeModule,
    AvatarModule,
    MenuModule,
    SlideMenuModule,
    VirtualScrollerModule,
    DialogModule,
    AutoCompleteModule
  ]
})
export class HomeModule { }
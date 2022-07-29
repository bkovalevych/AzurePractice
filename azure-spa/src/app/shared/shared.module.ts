import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelMenuModule } from 'primeng/panelmenu'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from './card/card.component';
import { TopicComponent } from './topic/topic.component';

@NgModule({
  declarations: [
    CardComponent,
    TopicComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    PanelMenuModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CardComponent,
    ButtonModule,
    InputTextModule,
    PanelMenuModule,
    FormsModule,
    ReactiveFormsModule,
    TopicComponent
  ]
})
export class SharedModule { }

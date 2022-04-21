import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerWidgetComponent } from './customer-widget/customer-widget.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [CustomerWidgetComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule
  ],
  exports: [
    CustomerWidgetComponent
  ]
})
export class ComponentsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './components/alert/alert.component';
import { AlertListComponent } from './components/alert-list/alert-list.component';
import { AlertService } from './services/alert.service';



@NgModule({
  declarations: [
    AlertComponent,
    AlertListComponent
  ],
  exports: [
    AlertListComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class AlertModule { }

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alert } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.sass']
})
export class AlertComponent {
  @Input()
  alert: Alert;
  @Output()
  close = new EventEmitter<void>();
}

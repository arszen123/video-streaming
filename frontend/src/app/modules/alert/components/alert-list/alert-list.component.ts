import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertService, Alert } from '../../services/alert.service';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.sass']
})
export class AlertListComponent {

  readonly alerts$: Observable<Alert[]>

  constructor(
    private alertService: AlertService,
  ) {
    this.alerts$ = this.alertService.list();
  }

  close(alert: Alert) {
    this.alertService.dismiss(alert);
  }

}

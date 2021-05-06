import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type AlertType = 'info' | 'warning' | 'danger' | 'success';

export interface AlertOption {
  duration?: number;
  type?: AlertType;
}

export interface Alert {
  text: string;
  options: AlertOption;
}

const DEFAULT_OPTIONS: AlertOption = {duration: 2000, type: 'info'};

@Injectable({
  providedIn: 'any',
})
export class AlertService {

  private queue$ = new BehaviorSubject<Alert[]>([]);
  private queue: Alert[] = [];

  open(text: string, options?: AlertOption) {
    options = {...DEFAULT_OPTIONS, ...options};
    const alert: Alert = {text, options};
    this.queue.push(alert);
    this.queue$.next(this.queue);
    setTimeout(() => {
      this.dismiss(alert);
    }, options.duration);
  }

  list(): Observable<Alert[]> {
    return this.queue$;
  }

  dismiss(alert: Alert) {
    this.queue = this.queue.filter(value => value !== alert);
    this.queue$.next(this.queue);
  }
}

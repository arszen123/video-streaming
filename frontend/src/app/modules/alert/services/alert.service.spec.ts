import { TestBed } from '@angular/core/testing';

import { Alert, AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('list should return the list of alerts', () => {
    const alerts: Alert[] = [
      {text: 'Test1', options: {duration: 2000, type: 'success'}},
      {text: 'Test2', options: {duration: 2000, type: 'success'}},
    ];
    alerts.forEach(alert => service.open(alert.text, alert.options));
    service.list().subscribe(list => {
      expect(list.length).toEqual(alerts.length);
    })
  });
});

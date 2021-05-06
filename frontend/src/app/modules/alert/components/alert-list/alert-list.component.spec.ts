import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alert, AlertService } from '../../services/alert.service';
import { AlertComponent } from '../alert/alert.component';

import { AlertListComponent } from './alert-list.component';

describe('AlertListComponent', () => {
  let component: AlertListComponent;
  let fixture: ComponentFixture<AlertListComponent>;
  let alertService: jasmine.SpyObj<AlertService>;
  let alerts: Alert[];

  beforeEach(async () => {
    const alertSpy = jasmine.createSpyObj('AlertService', ['list', 'dismiss']);
    await TestBed.configureTestingModule({
      declarations: [ AlertListComponent, AlertComponent ],
      providers: [
        {provide: AlertService, useValue: alertSpy},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;

    alerts = [
      {text: 'Test1', options: {type: 'success', duration: 2000}},
      {text: 'Test2', options: {type: 'success', duration: 2000}},
      {text: 'Test3', options: {type: 'success', duration: 2000}},
    ];
    alertService.list.and.returnValue(new BehaviorSubject(alerts));
    alertService.dismiss.and.callFake((alert) => {
      alerts = alerts.filter(v => v !== alert);
      (alertService.list() as BehaviorSubject<Alert[]>).next(alerts);
    });

    fixture = TestBed.createComponent(AlertListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list of alerts', () => {
    const alertElements: HTMLDivElement = fixture.nativeElement.querySelector('.alert-list');
    expect(alertElements.childElementCount).toEqual(3);
  });

  it('should display the newly added alert', () => {
    alerts.push(
      {text: 'Test4', options: {type: 'success', duration: 2000}}
    );
    (alertService.list() as BehaviorSubject<Alert[]>).next(alerts);
    fixture.detectChanges();
    const alertElements: HTMLDivElement = fixture.nativeElement.querySelector('.alert-list');
    expect(alertElements.childElementCount).toEqual(4);
  });

  it('should not display the removed alerts', () => {
    component.close(alerts[0]);
    (alertService.list() as BehaviorSubject<Alert[]>).next(alerts);
    fixture.detectChanges();
    const alertElements: HTMLDivElement = fixture.nativeElement.querySelector('.alert-list');
    expect(alertElements.childElementCount).toEqual(2);
  });
});

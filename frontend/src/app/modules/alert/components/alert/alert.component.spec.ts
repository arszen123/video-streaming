import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Alert } from '../../services/alert.service';

import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let alert: Alert;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    alert = {text: 'Test', options: {type: 'success', duration: 2000}};
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    component.alert = alert;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display alert correctly', () => {
    const alertContainer: HTMLDivElement = fixture.nativeElement.querySelector('div');
    expect(alertContainer.textContent.trim()).toEqual(alert.text);
    expect(alertContainer.classList.contains('alert-success')).toBeTruthy();
  });
});

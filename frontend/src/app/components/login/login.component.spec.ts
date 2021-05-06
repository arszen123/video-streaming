import { ComponentFixture, TestBed } from '@angular/core/testing';
import {AngularFireAuth} from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AngularFireAuth>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AngularFireAuth', ['signInWithEmailAndPassword'])
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        {provide: AngularFireAuth, useValue: spy},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    authService = TestBed.inject(AngularFireAuth) as jasmine.SpyObj<AngularFireAuth>;
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log in a user after form is submitted', () => {
    const submitElement: HTMLButtonElement = fixture.nativeElement.querySelector('#submit');
    component.form.setValue({
      email: 'example@example.com',
      password: 'myPassword$',
    });
    fixture.detectChanges();
    submitElement.click();
    expect(authService.signInWithEmailAndPassword).toHaveBeenCalled();
  })
});

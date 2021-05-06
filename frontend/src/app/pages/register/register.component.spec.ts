import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth'
import { RegisterComponent } from './register.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AngularFireAuth>;

  beforeEach(async () => {
    const spyObj = jasmine.createSpyObj('AngularFireAuth', ['createUserWithEmailAndPassword']);
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        {provide: AngularFireAuth, useValue: spyObj}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    authService = TestBed.inject(AngularFireAuth) as jasmine.SpyObj<AngularFireAuth>;
    // @ts-ignore
    authService.createUserWithEmailAndPassword.and.returnValue(new Promise(res => res({})));
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register a new user when the form is submitted', () => {
    const submitElement: HTMLButtonElement = fixture.nativeElement.querySelector('#submit');
    const cred = {email: 'example@example.com', password: 'My$ecretPassword'}
    component.form.setValue(cred);
    fixture.detectChanges();
    submitElement.click();
    expect(authService.createUserWithEmailAndPassword).toHaveBeenCalled();
  });
});

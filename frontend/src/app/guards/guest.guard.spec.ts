import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AngularFireAuth } from '@angular/fire/auth';

import { GuestGuard } from './guest.guard';

describe('GuestGuard', () => {
  let guard: GuestGuard;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AngularFireAuth', [], ['user']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {provide: AngularFireAuth, useValue: spy},
        AuthGuard
      ],
    });
    guard = TestBed.inject(GuestGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

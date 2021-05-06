import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AngularFireAuth', [], ['user']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {provide: AngularFireAuth, useValue: spy},
        AuthGuard
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

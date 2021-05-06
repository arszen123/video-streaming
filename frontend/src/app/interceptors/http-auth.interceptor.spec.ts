import {AngularFireAuth} from '@angular/fire/auth';
import { TestBed } from '@angular/core/testing';

import { HttpAuthInterceptor } from './http-auth.interceptor';

describe('HttpAuthInterceptor', () => {
  beforeEach(() => {
    const spy = jasmine.createSpyObj('AngularFireAuth', [], ['idToken']);
    TestBed.configureTestingModule({
      providers: [
        {provide: AngularFireAuth, useValue: spy},
        HttpAuthInterceptor,
      ]
    })
  });

  it('should be created', () => {
    const interceptor: HttpAuthInterceptor = TestBed.inject(HttpAuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});

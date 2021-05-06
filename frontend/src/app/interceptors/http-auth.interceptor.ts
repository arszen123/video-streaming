import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import { concatAll, map } from 'rxjs/operators';
@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: AngularFireAuth
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.auth.idToken.pipe(
      map(token => {
        if (token) {
          request = request.clone({
            headers: request.headers.append('Authorization', `Bearer ${token}`)
          })
        }
        return request;
      }),
      map(request => next.handle(request)),
      concatAll()
    );
  }
}

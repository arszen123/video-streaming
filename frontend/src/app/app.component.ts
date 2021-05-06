import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase';
import { AlertService } from './modules/alert';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Video streaming';
  readonly user$: Observable<firebase.User | null>;
  readonly isAuthenticated$: Observable<boolean>;

  constructor(
    private auth: AngularFireAuth,
    private alertService: AlertService,
  ) {
    this.user$ = auth.user;
    this.isAuthenticated$ = this.user$.pipe(map(user => user !== null));
  }

  logout() {
    this.auth.signOut().then(() => {
      this.alertService.open('You have been signed out!');
    })
  }
}

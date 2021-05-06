import { Component } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/modules/alert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  constructor(
    private auth: AngularFireAuth,
    private alertService: AlertService,
  ) { }

  login(formElement: HTMLFormElement) {
    if (formElement.checkValidity() && this.form.valid) {
      const {email, password} = this.form.value
      this.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.alertService.open('Login success!');
      }).catch(e => {
        if (e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found') {
          this.alertService.open('Wrong username or password!', {type: 'warning'});
        }
      })
    }
  }

}

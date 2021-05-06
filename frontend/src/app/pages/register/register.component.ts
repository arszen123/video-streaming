import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { AlertService } from 'src/app/modules/alert';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private alertService: AlertService,
  ) { }

  register(formElement: HTMLFormElement) {
    if (formElement.checkValidity() && this.form.valid) {
      const {email, password} = this.form.value;
      this.auth
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          this.alertService.open('Registration success! Redirecting...');
          this.router.navigateByUrl('');
        })
        .catch(() => {
          this.alertService.open('Wrong username or password!', {type: 'warning'});
        })
    }
  }

}

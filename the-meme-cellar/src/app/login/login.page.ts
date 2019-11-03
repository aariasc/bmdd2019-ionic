import {Component, OnInit} from '@angular/core';
import {UserService} from '../shared/user.service';
import {Router} from '@angular/router';
import {ToastController, LoadingController} from '@ionic/angular';
import {NgForm} from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    // console.log(form.value.email);
    // console.log(form.value.password);

    this.loadingController
      .create({keyboardClose: true, message: 'Signing in...'})
      .then(loadingEl => {
        loadingEl.present();
        // You can use firebase directly
        firebase
          .auth()
          .signInWithEmailAndPassword(form.value.email, form.value.password)
          .then(userData => {
            loadingEl.dismiss();
            if (userData.user.emailVerified) {
              form.reset();
              this.userService.setUserIsLoggedIn();
              this.router.navigateByUrl('/home');
            } else {
              this.showToastMessage('Verify your email', 'You need to verify your email');
            }
          })
          .catch(err => {
            loadingEl.dismiss();
            this.showToastMessage('Error logging in', err.message);
          });
      });
  }

  async showToastMessage(title: string, content: string, timeout: number = 3000) {
    const toast = await this.toastController.create({
      header: title,
      message: content,
      position: 'top',
      duration: timeout,
      buttons: [
        {
          text: 'Close',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }
}

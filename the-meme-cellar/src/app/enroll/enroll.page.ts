import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../shared/user.service';
import {ToastController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.page.html',
  styleUrls: ['./enroll.page.scss']
})
export class EnrollPage implements OnInit {
  constructor(
    private userService: UserService,
    private toastController: ToastController,
    private router: Router,
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
      .create({keyboardClose: true, message: 'Enrolling...'})
      .then(loadingEl => {
        loadingEl.present();
        this.userService
          .enroll(form.value.email, form.value.password)
          .then(result => {
            loadingEl.dismiss();
            form.reset();
            this.showToastMessage('Success', 'Check your email to activate your account');
            this.router.navigateByUrl('/login');
          })
          .catch(err => {
            loadingEl.dismiss();
            this.showToastMessage('Enrollment error', err.message);
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

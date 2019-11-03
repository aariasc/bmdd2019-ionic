import {Component, OnInit} from '@angular/core';
import {Meme} from '../shared/meme.models';
import {MemeService} from '../shared/meme.service';
import {
  ActionSheetController,
  IonItemSliding,
  AlertController,
  ModalController,
  LoadingController,
  ToastController
} from '@ionic/angular';
import {ModalViewComponent} from '../modals/modal-view/modal-view.component';
import {UserService} from '../shared/user.service';
import {Router} from '@angular/router';
import {ModalNewComponent} from '../modals/modal-new/modal-new.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  memes: Meme[];
  private memesSub: Subscription;
  private currentUserId = '';

  constructor(
    private memeService: MemeService,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private modalController: ModalController,
    private userService: UserService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.userService.currentUserId;

    // Subscribe to new memes in firebase
    this.memesSub = this.memeService.getFireMemes().subscribe(memes => {
      this.memes = memes;
    });
  }

  ionViewWillEnter() {
    // Fetch memes from firebase, which will trigger an event on the
    // subscription on line 43
    this.memeService.getAllMemes(this.currentUserId);
  }

  async showOtherActions(memeId: string, memeTitle: string, memeUrl: string, item: IonItemSliding) {
    const actionSheet = await this.actionSheetController.create({
      header: `Other Actions for ${memeTitle}`,
      buttons: [
        {
          text: 'View',
          icon: 'eye',
          handler: () => {
            console.log(`Sharing meme with id ${memeId} and title ${memeTitle}`);
            // this.presentAlert('View', memeTitle, memeId);
            item.close();
            this.viewMeme(memeTitle, memeUrl);
          }
        },
        {
          text: 'Share',
          icon: 'share',
          handler: () => {
            console.log(`Sharing meme with id ${memeId} and title ${memeTitle}`);
            this.presentAlert('Share', memeTitle, memeId);
            item.close();
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log('Delete clicked');
            // this.presentAlert('Delete', memeTitle, memeId);
            item.close();
            this.handleDeleteMeme(memeTitle, memeId);
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            item.close();
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async presentAlert(action: string, memeTitle: string, memeId: string) {
    const alert = await this.alertController.create({
      header: `You just clicked on ${action}`,
      subHeader: `Action performed on ${memeTitle}`,
      message: `memeId = ${memeId}`,
      buttons: ['Cool']
    });

    await alert.present();
  }

  async handleDeleteMeme(memeTitle: string, memeId: string) {
    const alert = await this.alertController.create({
      header: 'Oh noes!',
      subHeader: 'But why???',
      message: `Are you sure you want to delete the meme ${memeTitle}`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel! Whew');
          }
        },
        {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            // this.memeService.deleteMeme(memeId);
            // this.fetchMemes();
            this.memeService.deleteMeme(memeId, this.currentUserId);
            this.memeService.getAllMemes(this.currentUserId);
            this.showToastMessage('Kapow!', 'Meme deleted');
          }
        }
      ]
    });
    await alert.present();
  }

  async viewMeme(memeTitle: string, url: string) {
    const modal = await this.modalController.create({
      component: ModalViewComponent,
      componentProps: {
        title: memeTitle,
        imageUrl: url
      }
    });
    return await modal.present();
  }

  async addNewMeme() {
    console.log('clicked on new');
    const modal = await this.modalController.create({
      component: ModalNewComponent,
      componentProps: {
        userId: this.currentUserId
      }
    });
    modal.present();
    const modalResult = await modal.onWillDismiss();
    if (modalResult.role === 'success') {
      // console.log(modalResult.data);
      this.loadingController
        .create({keyboardClose: true, message: 'Storing...'})
        .then(loadingEl => {
          loadingEl.present();
          this.memeService
            .addNewMeme(modalResult.data.title, modalResult.data.fileUrl, this.currentUserId)
            .then(firebaseResult => {
              loadingEl.dismiss();
              // console.log(firebaseResult);
              this.memeService.getAllMemes(this.currentUserId);
              this.showToastMessage('Like a boss', 'New meme added!');
            });
        });
    } else {
      console.log('Dismissing modal');
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl('/login');
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

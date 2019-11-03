import {Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import {ModalController, Platform, LoadingController} from '@ionic/angular';
import {NgForm} from '@angular/forms';
import {Capacitor, Plugins, CameraSource, CameraResultType} from '@capacitor/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-modal-new',
  templateUrl: './modal-new.component.html',
  styleUrls: ['./modal-new.component.scss']
})
export class ModalNewComponent implements OnInit {
  @ViewChild('filePicker', {static: false}) filePickerRef: ElementRef<HTMLInputElement>;
  @Input() userId: string;
  usePicker = false;
  selectedImage: string;
  imageData: string | File;

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.usePicker = true;
      this.selectedImage = null;
    }
  }

  closeModal() {
    this.modalController.dismiss({}, 'cancel');
  }

  onSubmit(form: NgForm) {
    if (!form.valid && this.selectedImage !== '') {
      return;
    }
    console.log(form.value.title);

    this.loadingController
      .create({keyboardClose: true, message: 'Uploading...'})
      .then(loadingEl => {
        loadingEl.present();
        this.handleUpload().then(result => {
          loadingEl.dismiss();
          // console.log(result);
          const data = {fileUrl: result, title: form.value.title};
          this.modalController.dismiss(data, 'success');
        });
      });
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      width: 300,
      resultType: CameraResultType.Base64
    })
      .then(image => {
        this.selectedImage = image.base64String;
        this.imageData = this.selectedImage;
        // Sometimes the capacitor plugin will return a base64 string with the data:image/jpeg;base64
        // and sometimes without it.  In order to show it in the preview screen we need it to
        // contain the data:image/jpeg;base64, so we "remove it" and then add it again
        this.selectedImage.replace('data:image/jpeg;base64,', '');
        this.selectedImage = 'data:image/jpeg;base64,' + this.selectedImage;
      })
      .catch(error => {
        console.log(error);
        if (this.usePicker) {
          this.filePickerRef.nativeElement.click();
        }
        return false;
      });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imageData = pickedFile;
    };
    fr.readAsDataURL(pickedFile);
  }

  handleUpload() {
    let imageFile;
    if (typeof this.imageData === 'string') {
      try {
        imageFile = this._base64toBlob(
          this.imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = this.imageData;
    }

    const timestamp = new Date().getTime();
    const fileName = `memes/${this.userId}/${timestamp}.jpg`;
    const storageRef = firebase.storage().ref(fileName);
    return storageRef.put(imageFile, {contentType: 'image/jpeg'}).then(() => {
      return storageRef.getDownloadURL();
    });
  }

  // Misc function to transform a base64 string to Blob of type "contentType"
  _base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = window.atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, {type: contentType});
  }
}

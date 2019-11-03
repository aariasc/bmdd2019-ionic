import {Component, OnInit} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const firebaseConfig = {
      apiKey: 'your api key',
      authDomain: 'your auth domain',
      databaseURL: 'https://your-database-url',
      projectId: 'your project id',
      storageBucket: 'your storage bucket',
      messagingSenderId: 'your messaging sender ir',
      appId: 'your app id'
    };
    firebase.initializeApp(firebaseConfig);
  }
}

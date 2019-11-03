import {Injectable} from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userIsAuthenticated = false;

  constructor() {}

  setUserIsLoggedIn() {
    this.userIsAuthenticated = true;
  }

  logout() {
    firebase.auth().signOut();
    this.userIsAuthenticated = false;
  }

  get isUserAuthenticated() {
    return this.userIsAuthenticated;
  }

  get currentUserId() {
    return firebase.auth().currentUser.uid;
    // return 'test';
  }

  enroll(email: string, password: string) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userData => {
        userData.user.sendEmailVerification();
        firebase.auth().signOut();
      });
  }
}

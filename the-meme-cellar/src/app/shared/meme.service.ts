import {Injectable} from '@angular/core';
import {Meme} from './meme.models';
import * as firebase from 'firebase';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemeService {
  private fireMemes = new BehaviorSubject<Meme[]>([]);

  constructor() {}

  deleteMeme(memeId: string, userId: string) {
    const childRef = firebase.database().ref(`memes/${userId}/${memeId}`);
    childRef.remove();
  }

  addNewMeme(title: string, fileUrl: string, userId: string) {
    const basePath = `memes/${userId}`;

    const newMemeKey = firebase
      .database()
      .ref()
      .child(basePath)
      .push().key;

    const newMeme: Meme = {
      created: new Date().toString(),
      id: newMemeKey,
      imageUrl: fileUrl,
      timestamp: new Date().getTime(),
      title
    };

    const updates = {};
    updates[`${basePath}/${newMemeKey}`] = newMeme;
    return firebase
      .database()
      .ref()
      .update(updates);
  }

  getFireMemes() {
    return this.fireMemes.asObservable();
  }

  getAllMemes(userId: string) {
    return firebase
      .database()
      .ref('memes')
      .child(userId)
      .limitToLast(20)
      .orderByChild('timestamp')
      .once('value', data => {
        const memes: Meme[] = [];
        data.forEach(memeFromDatabase => {
          memes.push(memeFromDatabase.val());
        });
        this.fireMemes.next(memes);
      });
  }
}

import {Component, OnInit, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-modal-view',
  templateUrl: './modal-view.component.html',
  styleUrls: ['./modal-view.component.scss']
})
export class ModalViewComponent implements OnInit {
  @Input() title = '';
  @Input() imageUrl = '';

  slideOpts = {
    centeredSlides: 'true'
  };

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }
}

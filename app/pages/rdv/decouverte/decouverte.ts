import { Component, Input} from '@angular/core';
import { Page, NavController, NavParams, Events } from 'ionic-angular';
import {FlexInput} from '../../../components/flex-input/flex-input';




/*
  Generated class for the DiagConseilPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/rdv/decouverte/decouverte.html',
  directives: [FlexInput]
})
export class DecouvertePage {
  dataIn: any = {};
  dataOut: any = {};
  params: NavParams;
  constructor(private nav: NavController, params: NavParams, private events: Events) {
    this.params = params;
    this.dataIn = this.params.data;
    this.dataOut = {};
    this.events.subscribe('clientChange', eventData => {
      this.dataIn=eventData[0];
    });
  }
}

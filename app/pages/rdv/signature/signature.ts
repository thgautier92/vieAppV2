import { Component, Input} from '@angular/core';
import { Page, NavController, NavParams, Events } from 'ionic-angular';
import {FlexInput} from '../../../components/flex-input/flex-input';




/*
  Generated class for the DiagConseilPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/rdv/signature/signature.html',
  directives: [FlexInput]
})
export class SignaturePage {
  dataIn: any = {};
  idClient: any = "";
  dataOut: any = {};
  params: NavParams;
  statPage: any;
  constructor(private nav: NavController, params: NavParams, private events: Events) {
    this.params = params;
    this.idClient = this.params.data['currentCli'];
    this.dataIn = this.params.data['currentDoc'];
    this.dataOut = {};
    this.events.subscribe('clientChange', eventData => {
      console.log(eventData);
      this.idClient = eventData[0]['currentCli'];
      this.dataIn = eventData[0]['currentDoc'];
    });
  }
}

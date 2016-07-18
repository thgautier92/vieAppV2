import { Component, Input } from '@angular/core';
import { Page, NavController, NavParams } from 'ionic-angular';
import {FlexInput} from '../../../components/flex-input/flex-input'



/*
  Generated class for the DiagConseilPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/rdv/diag-conseil/diag-conseil.html',
  directives: [FlexInput],
})
export class DiagConseilPage {
  dataIn: any = {};
  dataOut: any = {};
  idMenu: any;
  constructor(private nav: NavController, private params:NavParams) {
    this.idMenu = this.params.get('idMenu');
    this.dataIn = this.params.get('dataIn');
    this.dataOut={};
  }
}

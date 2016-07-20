import { Component, Input, AfterViewChecked,ViewChild, ViewChildren } from '@angular/core';
import { Page, NavController, NavParams } from 'ionic-angular';
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
export class DecouvertePage  {
  dataIn: any = {};
  dataOut: any = {};
  params: NavParams;
  constructor(private nav: NavController, params: NavParams) {
    this.params = params;
    this.dataIn = this.params.data;
    this.dataOut = {};
  }
  ngAfterContentChecked() {
    console.log("DECOUVERTE Change",this.params.data);
    //this.dataIn = this.params.data;
  }
}

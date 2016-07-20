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
  params:NavParams;
  constructor(private nav: NavController, params:NavParams) {
    this.params = params;
    this.dataIn = this.params.data;
    this.dataOut={};
  }
  ngAfterViewInit() {
    console.log("DIAG afterViewInit",this.dataIn);
  };
  ngOnChanges(changes: any) {
    console.log("DIAG Change",changes);
    this.dataIn = this.params.data;
  }
}

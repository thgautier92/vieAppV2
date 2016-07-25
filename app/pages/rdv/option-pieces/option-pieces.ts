import { Component } from '@angular/core';
import { Page, NavController, NavParams, Events, Modal, IONIC_DIRECTIVES, Platform, ViewController } from 'ionic-angular';
import { FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators, AbstractControl} from '@angular/common';
import {Paramsdata} from '../../../providers/params-data/params-data';
import {groupBy, ValuesPipe, KeysPipe} from '../../../pipes/common';

/*
  Generated class for the OptionPiecesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/rdv/option-pieces/option-pieces.html',
  pipes: [groupBy, ValuesPipe, KeysPipe],
  directives: [IONIC_DIRECTIVES, FORM_DIRECTIVES],
  providers: [Paramsdata]
})
export class OptionPiecesPage {
  idClient: any;
  dataIn: any;
  lstCible: any;
  lstNatureInfo: any;
  lstfields: any = [];
  cible: any = null;
  nature: any = "";
  constructor(private nav: NavController, params: NavParams, private viewCtrl: ViewController, private events: Events, private menu: Paramsdata) {
    this.idClient = params.data['currentCli'];
    this.dataIn = params.data['currentDoc'];
    this.lstCible = this.dataIn['clients'];
    this.lstNatureInfo = [
      { "code": "cni", "lib": "Carte d'identité Nationale"},
      { "code": "passport", "lib": "Passport"},
      { "code": "auto", "lib": "Permis de conduire"}
    ]
  }
  natureChange(idx) {

  }
  takePhoto(){}
  takeMail(){}
}

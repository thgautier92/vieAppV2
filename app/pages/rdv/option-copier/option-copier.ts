import { Component } from '@angular/core';
import { Page, NavController, NavParams, Events, Modal, IONIC_DIRECTIVES, Platform, ViewController } from 'ionic-angular';
import { FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators, AbstractControl} from '@angular/common';

import {groupBy, ValuesPipe, KeysPipe} from '../../../pipes/common';

/*
  Generated class for the OptionCopierPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/rdv/option-copier/option-copier.html',
  pipes: [groupBy, ValuesPipe, KeysPipe],
  directives: [IONIC_DIRECTIVES, FORM_DIRECTIVES],
})
export class OptionCopierPage {
  idClient: any;
  dataIn: any;
  lstCible: any;
  lstNatureInfo: any;
  cible: any = null;
  nature: any = "";
  constructor(private nav: NavController, params: NavParams, private viewCtrl: ViewController, private events: Events) {
    this.idClient = params.data['currentCli'];
    this.dataIn = params.data['currentDoc'];
    this.lstCible = this.dataIn['clients'];
    console.log("Liste cible", this.lstCible);
    this.lstNatureInfo = [{ "code": "diag", "lib": "Diagnostic Conseil" }, { "code": "sous", "lib": "Souscription" }]

  }
  close() {
    this.viewCtrl.dismiss();
  }
  execute(){
    
  }
}

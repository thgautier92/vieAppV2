import { Component } from '@angular/core';
import { Camera } from 'ionic-native';
import { Page, NavController, NavParams, Events, Modal, Alert, IONIC_DIRECTIVES, Platform, ViewController } from 'ionic-angular';
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
  lstCible: any = [];
  lstNatureInfo: any;
  lstfields: any = [];
  cible: any = null;
  nature: any = "";
  base64Image: any = "img/camera.jpg";
  constructor(private nav: NavController, params: NavParams, private viewCtrl: ViewController, private events: Events, private menu: Paramsdata) {
    this.idClient = params.data['currentCli'];
    this.dataIn = params.data['currentDoc'];
    this.lstCible = [];
    for (let i in this.dataIn['clients']) {
      console.log(i, this.dataIn['clients'][i]);
      this.lstCible.push({ "id": i, "name": this.dataIn['clients'][i]['client']['output'][0]['NOM'], "sel": false })
    };
    console.log(this.lstCible);
    this.lstNatureInfo = [
      { "code": "cni", "lib": "Carte d'identité Nationale" },
      { "code": "passport", "lib": "Passport" },
      { "code": "auto", "lib": "Permis de conduire" }
    ]
  }
  close() {
    this.viewCtrl.dismiss();
  }
  natureChange(idx) { }
  takePhoto() {
    let options = {};
    let me=this;
    try {
      Camera.getPicture(options).then((imageData) => {
        me.base64Image = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        // Handle error
        let alert = Alert.create({
          title: 'Capture de documents',
          subTitle: 'Appareil non disponible : ' + err,
          buttons: ['OK']
        });
        this.nav.present(alert);
      });
    } catch (error) {
      let alert = Alert.create({
        title: 'Capture de documents',
        subTitle: 'Appareil non disponible : ' + error,
        buttons: ['OK']
      });
      this.nav.present(alert);
    }

  }
  takeMail() { }
  execute() {
    // Save data to the client folder
    for (let key in this.lstCible) {
      if (this.lstCible[key]['sel']) {
        this.dataIn.resultByClient[key]['doc'].push({ "nature": this.nature, "ts": new Date(), "img64": this.base64Image });
        this.events.publish('rdvSave', this.dataIn);
      }
    }

  }
}

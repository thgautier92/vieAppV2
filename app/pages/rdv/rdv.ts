import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';
import { FORM_DIRECTIVES,
  NgForm, FormBuilder, Control, ControlGroup, Validators, AbstractControl,
  NgSwitch, NgSwitchWhen, NgSwitchDefault} from '@angular/common';
import {groupBy, ValuesPipe, KeysPipe, textToDate} from '../../pipes/common';
import { CouchDbServices } from '../../providers/couch/couch';
import {Paramsdata} from '../../providers/params-data/params-data';
import {DisplayTools} from '../comon/display';

import * as DiagConseil from './diag-conseil/diag-conseil';
import {StartPage} from '../start/start';


declare var PouchDB: any;
/*
  Generated class for the RdvPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/rdv/rdv.html',
  providers: [Paramsdata, CouchDbServices, DisplayTools],
  pipes: [groupBy, ValuesPipe, KeysPipe, textToDate]
})
export class RdvPage {
  db: any;
  base: any;
  currentRdv: any = {};
  lstCli: any = [];
  rdvId: any;
  dataMenu: any;
  constructor(private platform: Platform, private nav: NavController, navParams: NavParams,
    private display: DisplayTools, private couch: CouchDbServices,
    private paramsApi: Paramsdata, fb: FormBuilder) {
    this.platform = platform;
    this.base = navParams.get("base");
    this.rdvId = navParams.get("rdvId");
    this.db = new PouchDB(this.base);
    // Load Menu forms
    this.paramsApi.loadMenu().then((result) => {
      //console.log("Forms params:", result);
      this.dataMenu = result;
      //this.paramsApi.initDataForms();
    }, (error) => {
      console.log("Error", error);
      this.dataMenu = null;
    });
  }
  ngAfterViewInit() {
    this.getRdv(this.rdvId);
  }
  getRdv(id) {
    let me = this;
    this.db.get(id).then(function (doc) {
      console.log(doc);
      me.currentRdv = doc;
      me.currentRdv.rdv['result'] = [];
      for (var idx in doc.clients) {
        let cli=doc.clients[idx]
        me.currentRdv.rdv['result'].push({
          clientId: cli['client']['output'][0]['REF'],
          clientName: cli['client']['output'][0]['NOM'],
          clientPrenom: cli['client']['output'][0]['PRENOM'],
          etatVie:cli['client']['output'][0]['ETATVIE'],
          rdvStatus: false
        });
      }
      me.lstCli = me.currentRdv.rdv.result;
      console.log(me.currentRdv);
    });
  }
  start(idx){
    console.log(idx);
    let d=this.currentRdv.clients[idx];
    console.log("Data client",d);
    this.nav.push(DiagConseil.DiagConseilPage,{"idMenu":1,"dataIn":d}).then(data=>{
      console.log("Data return from form",data);
    });


  }
}

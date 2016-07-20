import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, NavParams, Tabs } from 'ionic-angular';
import { FORM_DIRECTIVES,
  NgForm, FormBuilder, Control, ControlGroup, Validators, AbstractControl,
  NgSwitch, NgSwitchWhen, NgSwitchDefault} from '@angular/common';
import {groupBy, ValuesPipe, KeysPipe, textToDate} from '../../pipes/common';
import {CouchDbServices} from '../../providers/couch/couch';
import {Paramsdata} from '../../providers/params-data/params-data';
import {DisplayTools} from '../comon/display';

import {DiagConseilPage} from './diag-conseil/diag-conseil';
import {DecouvertePage} from './decouverte/decouverte';
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
  @ViewChild('rdvTabs') rdvTabs: any;
  db: any;
  base: any;
  currentRdv: any = {};
  currentCli: any = null;
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
    this.dataMenu = [
      { "id": 1, "status": "Hold", "lib": "Connaissance Client", "icon": "person", "page": DecouvertePage, "form": 1 },
      { "id": 2, "status": "Hold", "lib": "Diagnostic Conseil", "icon": "home", "page": DiagConseilPage, "form": 2 },
    ]
  }
  ngAfterViewInit() {
    this.getRdv(this.rdvId);
  }
  getRdv(id) {
    let me = this;
    this.db.get(id).then(function (doc) {
      //console.log(doc);
      me.currentRdv = doc;
      // Create JSON Structure for data input by application
      me.currentRdv.rdv['result'] = [];
      for (var idx in doc.clients) {
        let cli = doc.clients[idx]
        me.currentRdv.rdv['result'].push({
          clientId: cli['client']['output'][0]['REF'],
          clientName: cli['client']['output'][0]['NOM'],
          clientPrenom: cli['client']['output'][0]['PRENOM'],
          etatVie: cli['client']['output'][0]['ETATVIE'],
          rdvStatus: false
        });
      }
      me.lstCli = me.currentRdv.rdv.result;
      //console.log("Current RDV", me.currentRdv);
    }).catch(function (error) {
      console.error(error);
    });
  }
  start(idx) {
    this.currentCli = this.currentRdv.clients[idx];
    console.log("Data client", this.currentCli);
    console.log("Tabs ", this.rdvTabs);
    /*this.nav.push(DiagConseilPage, { "idMenu": 1, "dataIn": this.currentCli }).then(data => {
      console.log("Data return from form", data);
    });
    */
  }
  retrieveData() {
    return this.currentCli;
  }
}

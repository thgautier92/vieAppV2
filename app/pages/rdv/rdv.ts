import { Component, Output, EventEmitter } from '@angular/core';
import { Platform, NavController, NavParams, Events, Tabs, MenuController } from 'ionic-angular';
import { FORM_DIRECTIVES,
  NgForm, FormBuilder, Control, ControlGroup, Validators, AbstractControl,
  NgSwitch, NgSwitchWhen, NgSwitchDefault} from '@angular/common';
import {groupBy, ValuesPipe, KeysPipe, textToDate} from '../../pipes/common';
import {CouchDbServices} from '../../providers/couch/couch';
import {Paramsdata} from '../../providers/params-data/params-data';
import {DisplayTools} from '../comon/display';

import {DiagConseilPage} from './diag-conseil/diag-conseil';
import {DecouvertePage} from './decouverte/decouverte';
import {SignaturePage} from './signature/signature';
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
  currentCli: any = null;
  currentContext: any;
  lstCli: any = [];
  rdvId: any;
  dataMenu: any;
  rdvMenu: any;
  constructor(private platform: Platform, private nav: NavController, navParams: NavParams, public events: Events, private menuOpt: MenuController,
    private display: DisplayTools, private couch: CouchDbServices,
    private paramsApi: Paramsdata, fb: FormBuilder) {
    this.platform = platform;
    this.base = navParams.get("base");
    this.rdvId = navParams.get("rdvId");
    this.db = new PouchDB(this.base);
    this.dataMenu = [
      { "id": 1, "status": "Hold", "lib": "Connaissance Client", "icon": "person", "page": DecouvertePage, "form": 1 },
      { "id": 2, "status": "Hold", "lib": "Diagnostic Conseil", "icon": "home", "page": DiagConseilPage, "form": 2 },
      { "id": 3, "status": "Hold", "lib": "Signatures", "icon": "ribbon", "page": SignaturePage, "form": 7 },
    ]
    this.rdvMenu = [
      { "id": 1, "lib": "Connaissance Client", "icon": "person", "page": DecouvertePage },
      { "id": 2, "lib": "Diagnostic Conseil", "icon": "home", "page": DiagConseilPage },
      { "id": 3, "lib": "Signatures", "icon": "ribbon", "page": SignaturePage },
    ];
    events.subscribe('rdvSave', eventData => {
      this.saveData(eventData[0]);
    });
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
      let idResult = "resultByClient";
      me.currentRdv.rdv[idResult] = [];
      for (var idx in doc.clients) {
        let cli = doc.clients[idx]
        me.currentRdv.rdv[idResult].push({
          clientId: cli['client']['output'][0]['REF'],
          clientName: cli['client']['output'][0]['NOM'],
          clientPrenom: cli['client']['output'][0]['PRENOM'],
          etatVie: cli['client']['output'][0]['ETATVIE'],
          forms: [],
          rdvStatus: false,
        });
      }
      me.lstCli = me.currentRdv.rdv[idResult];
      //console.log("Current RDV", me.currentRdv);
    }).catch(function (error) {
      console.error(error);
    });
  }
  start(idx) {
    this.currentCli = idx;
    console.log("Select client Index", this.currentCli);
    //this.dataMenu[idx]['status'] = "Started";
    this.currentContext = { "currentCli": this.currentCli, "currentDoc": this.currentRdv }
    this.events.publish('clientChange', this.currentContext);
  }
  retrieveData() {
    return this.currentContext;
  }
  // Save data in PouchDb locally
  saveData(docPut) {
    let me=this;
    console.log("RDV to save in Pouch", docPut);
    let id=docPut['_id'];
    this.db.get(id).then(function (docLocal) {
      //console.log(docLocal);
      let rev = docLocal['_rev'];
      let up={_id: id, _rev: rev, clients: docPut['clients'],rdv: docPut['rdv']};
      return me.db.put(up);
    }).then(function (response) {
      //console.log(response);
    }).catch(function (err) {
      console.error(err);
    });
  };
  // Navigation Menu
  callMenu(item) {
    this.nav.push(item.page);
  }
}

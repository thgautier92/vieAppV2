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
import {SouscriptionPage} from './souscription/souscription';
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
  refStatus: any = []
  currentRdv: any = {};
  currentCli: any = null;
  titleRdv:any = "";
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
    this.refStatus = [
      { "code": "hold", "lib": "Attente", "color": "danger" },
      { "code": "partial", "lib": "Partiel", "color": "favorite" },
      { "code": "completed", "lib": "Complet", "color": "secondary" },
    ]
    this.dataMenu = [
      { "id": 1, "status": "hold", "lib": "Connaissance Client", "icon": "person", "page": DecouvertePage},
      { "id": 2, "status": "hold", "lib": "Diagnostic Conseil", "icon": "home", "page": DiagConseilPage},
      { "id": 3, "status": "hold", "lib": "Souscription", "icon": "home", "page": SouscriptionPage},
      { "id": 4, "status": "hold", "lib": "Signatures", "icon": "ribbon", "page": SignaturePage},
    ]
    this.rdvMenu = [
      { "id": 1, "lib": "Recopier", "icon": "person", "page": null },
      { "id": 2, "lib": "Pièces", "icon": "home", "page": null },
      { "id": 3, "lib": "action 3", "icon": "ribbon", "page": null },
    ];
    // ===== Events operation on page =====
    events.subscribe('rdvSave', eventData => {
      this.saveData(eventData[0]);
    });
    events.subscribe('menuStatusChange', eventData => {
      console.log("Update status menu", eventData);
      let idMenu = eventData[0]['id'];
      let m = this.dataMenu.filter(item => item['id'] === idMenu);
      m[0]['status'] = eventData[0]['status'];
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
    console.log("Select client Index", this.currentCli);
    this.titleRdv = this.currentRdv['clients'][idx]['client']['output'][0]['NOM'];
    this.currentCli = idx;
    //this.currentContext = { "currentPage": null, "currentCli": this.currentCli, "currentDoc": this.currentRdv }
    this.currentContext = {"currentCli": this.currentCli, "currentDoc": this.currentRdv }
    console.log("Current Context",this.currentContext);
    this.events.publish('clientChange', this.currentContext);
  }
  retrieveData(idx) {
    //this.currentContext['currentPage'] = idx - 1;
    return this.currentContext;
  }
  // Get the tab style, defined in the refStatus variable
  getStyle(status, field) {
    let r = this.refStatus.filter(item => item['code'] === status);
    return (r.length == 0) ? "ligth" : r[0][field];
  }
  // Save data in PouchDb locally
  saveData(docPut) {
    let me = this;
    console.log("RDV to save in Pouch", docPut);
    let id = docPut['_id'];
    this.db.get(id).then(function (docLocal) {
      //console.log(docLocal);
      let rev = docLocal['_rev'];
      let up = { _id: id, _rev: rev, clients: docPut['clients'], rdv: docPut['rdv'] };
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

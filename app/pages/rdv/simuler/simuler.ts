import { Component, Input} from '@angular/core';
import { Page, NavController, NavParams, Events, Modal, ViewController } from 'ionic-angular';
import {CalcTools} from '../../comon/calculate'
import {FlexInput} from '../../../components/flex-input/flex-input';
import {Simu} from '../../../providers/simu/simu';
import {ValuesPipe} from '../../../pipes/common';

/*
  Generated class for the DiagConseilPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/rdv/simuler/simuler.html',
  directives: [FlexInput],
  providers: [CalcTools, Simu],
  pipes: [ValuesPipe]
})
export class SimulerPage {
  popupWindow:any;
  lstForms: any = [];
  dataIn: any = {};
  idPage: any = {};
  idClient: any = "";
  idSimu: any = "";
  dataSimu: any = {};
  params: NavParams;
  pageStatus: any;
  constructor(private nav: NavController, params: NavParams, private viewCtrl: ViewController, private events: Events, private CalcTools: CalcTools, private simu: Simu) {
    this.params = params;
    this.popupWindow=null;
    //this.idPage = this.params.data['currentPage'];
    this.idPage = 3
    this.idClient = this.params.data['currentCli'];
    this.dataIn = this.params.data['currentDoc'];
    this.dataSimu = { "dateSimu": "","idSimu":"", "data": [] };
    this.lstForms = [
      { "id": 6, "status": "" }
    ];
    // Return events from inputs forms
    this.events.subscribe('clientChange', eventData => {
      this.idClient = eventData[0]['currentCli'];
      this.dataIn = eventData[0]['currentDoc'];
      for (var key in this.lstForms) { this.lstForms[key]['status'] = ""; }
      CalcTools.calcPageStatus(this.idPage, this.lstForms);
    });
    this.events.subscribe('rdvStatus_' + this.idPage, dataReturn => {
      console.log("Update status form", this.lstForms, dataReturn);
      let idForm = dataReturn[0]['form']['id'];
      let f = this.lstForms.filter(item => item['id'] === idForm);
      f[0]['status'] = dataReturn[0]['status'];
      CalcTools.calcPageStatus(this.idPage, this.lstForms);
    });
    this.events.subscribe('rdvSave', eventData => {
      console.log(eventData);
      this.idSimu = eventData[0]['rdv']['resultByClient'][this.idClient]['forms'][6]['extraData']['idSimu'];
      // get data Simu 
      simu.getSimu(this.idSimu).then(res => {
        let data = res['results']['output'][0];
        this.dataSimu = {"idSimu":this.idSimu, "dateSimu": data['datemaj'], "data": JSON.parse(data['dataout']) };
        //console.log(this.dataSimu);
        // call dataSave and close windows
        this.popupWindow.close();
      });
    });
    this.events.subscribe('simuStart',eventData=>{
      console.log(eventData);
      this.popupWindow=eventData[1];
      //console.log(this.popupWindow);
      this.dataSimu['dateSimu']=eventData[0]['time_stamp'];
      this.dataSimu['idSimu']=eventData[0]['insert_id'];
    });
    this.events.subscribe('simuDataLoaded',eventData=>{
      //console.log(eventData);
      this.dataSimu['data']=JSON.parse(eventData[0]['dataout']);
    })
  }
  close() {
    this.viewCtrl.dismiss();
  }
}

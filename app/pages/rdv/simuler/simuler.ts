import { Component, Input} from '@angular/core';
import { Page, NavController, NavParams, Events } from 'ionic-angular';
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
  pipes:[ValuesPipe]
})
export class SimulerPage {
  lstForms: any = [];
  dataIn: any = {};
  idPage: any = {};
  idClient: any = "";
  idSimu: any = "";
  dataSimu: any = {};
  params: NavParams;
  pageStatus: any;
  constructor(private nav: NavController, params: NavParams, private events: Events, private CalcTools: CalcTools, private simu: Simu) {
    this.params = params;
    //this.idPage = this.params.data['currentPage'];
    this.idPage = 3
    this.idClient = this.params.data['currentCli'];
    this.dataIn = this.params.data['currentDoc'];
    this.dataSimu={"dateSimu":"","data":[]};
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
      this.simu.getSimu(this.idSimu).then(res => {
          let data=res['results']['output'][0];
          this.dataSimu={"dateSimu":data['datemaj'],"data":JSON.parse(data['dataout'])};
          console.log(this.dataSimu);
          // call dataSave
      });
    });
  }
}

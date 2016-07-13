import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {DisplayTools} from '../comon/display';
import {StartPage} from '../start/start';

/*
  Generated class for the HomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [DisplayTools]
})
export class HomePage {
  items: any;
  display: any;
  constructor(public nav: NavController, display: DisplayTools) {
    this.nav = nav;
    this.display = display;
    this.items = [
      { 'title': 'Start', 'icon': 'regime_retraite_complementaire.jpg', 'description': "Démarrer un RDV", 'link': StartPage, 'color': this.display.getRandomColor() },
    ]
  }
  openNavDetailsPage(item) {
    this.nav.push(item.link);
  }
}

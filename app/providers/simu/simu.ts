import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Simu provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Simu {
  data: any;
  rootUrl:any = "http://gautiersa.fr/vie";

  constructor(private http: Http) {
    this.data = null;
  }

  callSimu() {
    let url=this.rootUrl+"/simu";
    let dataCall:any={};
    return new Promise(resolve => {
      this.http.post(url,dataCall)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          resolve(this.data);
        });
    });
  }
}


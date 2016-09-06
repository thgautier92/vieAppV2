import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Sign providers.
  DOCUSIGN
  UNIVERSIGN
  LEGALBOX

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SignServices {
  rootApi: any;
  httpApi: any;
  params: any;
  constructor(private http: Http) {
    this.params = [
      {
        "serv": "docuSign", "params": {
          "rootApi": "https://demo.docusign.net/restapi/v2",
          "corsApi": "/docuSign/restApi/v2",
          "email": "thierry_gautier@groupe-sma.fr",
          "password": "Tga051163",
          "integratorKey": "TEST-43dd500e-9abc-42da-8beb-3d3f14698fbd",
          "account": "1549349"
        }
      },
      { "serv": "univerSign", "params": {} },
      { "serv": "docaPost", "params": {} }];
  }
  getLstParams() {
    return new Promise((resolve, reject) => {
      let lst=[];
      this.params.forEach(element => {
        console.log(element);
        lst.push(element['serv']);
      });
      resolve(lst);
    });
  }
  getSrv(srv) {
    this.rootApi = "";
    this.httpApi = {};
    this.loadRootApi(srv).then(response => {
      console.log(response);
      this.rootApi = response;
      //load Http header
      this.loadHeader(srv).then(response => {
        this.httpApi = response;
      }, error => {
        console.log("Unable to load HEADER " + srv);
      });
    }, error => {
      console.log("Unable to load API " + srv);
    });
  }
  loadRootApi(srv) {
    return new Promise((resolve, reject) => {
      let root = "";
      let param = this.params.filter(item => item['serv'] === srv);
      console.log(param)
      if (param.length > 0) {
        resolve(param[0])
      } else {
        reject("Fournisseur inconnu");
      }
    })
  };
  loadHeader(srv) {
    return new Promise((resolve, reject) => {
      let header = "";
      let http = {};
      http = {
        cache: false,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-DocuSign-Authentication': header }
      };
      resolve(http);
    })
  };
  load(srv) {
    return new Promise((resolve, reject) => {
      this.getSrv(srv);
      this.http.get(this.rootApi)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
}


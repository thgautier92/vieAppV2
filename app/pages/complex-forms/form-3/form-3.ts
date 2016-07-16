import { Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {Page, NavController, NavParams, Storage, SqlStorage, LocalStorage,Tabs} from 'ionic-angular';
import {groupBy, ValuesPipe, KeysPipe} from '../../../pipes/common';
import {Form1Page} from '../form-1/form-1';

declare var PouchDB: any;
/*
  Generated class for the Form3Page page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/complex-forms/form-3/form-3.html',
  pipes: [groupBy, ValuesPipe, KeysPipe]
})
export class Form3Page implements AfterViewInit {
  db: any;
  store: Storage;
  items: any;
  constructor(public nav: NavController, navParams: NavParams) {
    console.log("Nav Param",navParams);
    this.db = new PouchDB('vie_app');
    console.log(this.db);
    this.items = [];
    this.store = new Storage(LocalStorage);
  };
  ngAfterViewInit() {
    this.doRefresh();
  }
  doRefresh(refresher?) {
    let me = this;
    this.db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
      console.log(err, doc);
      if (doc.total_rows !== 0) {
        me.items = new groupBy().transform(doc.rows, 'doc', 'USERID');
        //console.log("Items grouped",me.items)
        //me.items = doc.rows;
      }
      if (refresher) refresher.complete();
    });
  };
  itemSelected(item) {
    this.store.set("currrentId", JSON.stringify(item));
    var t: Tabs = this.nav.parent;
    t.select(1);
  }
}

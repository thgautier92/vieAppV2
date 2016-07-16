import {Page, NavController, NavParams, Storage, SqlStorage, LocalStorage} from 'ionic-angular';
import { FORM_DIRECTIVES,
  NgForm, FormBuilder, Control, ControlGroup, Validators, AbstractControl,
  NgSwitch, NgSwitchWhen, NgSwitchDefault} from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {groupBy, ValuesPipe, KeysPipe} from '../../../pipes/common';
import {Paramsdata} from '../../../providers/params-data/params-data';
/*
  Generated class for the FormInputPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/complex-forms/form-input/form-input.html',
  providers: [Paramsdata],
  directives: [FORM_DIRECTIVES, NgSwitch, NgSwitchWhen, NgSwitchDefault],
  pipes: [groupBy, ValuesPipe, KeysPipe]
})
export class FormInputPage implements AfterViewInit {
  store: Storage;
  selectedMenu: any;
  selectedForm: any = null;
  selectedFields: any = null;
  titleForm: any;
  paramsApi: Paramsdata;
  myForm: ControlGroup;
  form: any;
  fb: FormBuilder;
  dataInput: any;
  constructor(private nav: NavController, navParams: NavParams, paramsApi: Paramsdata, fb: FormBuilder) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedMenu = navParams.get('menu');
    console.log("Menu selected", this.selectedMenu);
    this.paramsApi = paramsApi;
    this.fb = fb;
    this.form = this.fb.group({});
    this.selectedForm = false;
    this.store = new Storage(LocalStorage);
  }
  ngAfterViewInit() {
    this.loadForm(this.selectedMenu['form']);
  }
  loadForm(id) {
    this.store.get("currrentId").then((data) => {
      this.dataInput = JSON.parse(data);
      console.log("Init Form for data", this.dataInput);
      this.selectedForm = [];
      this.selectedFields = [];
      this.form = this.fb.group({});
      this.paramsApi.getForm(id, this.dataInput).then(data => {
        console.log("== Return form data ", id, data);
        this.form = data['formGroup'];
        this.selectedForm = data['form'];
        // Group fields array
        this.selectedFields = new groupBy().transform(this.selectedForm['fields'], 'group');
        this.selectedMenu.status = "Started";
        console.log("Display form", this.selectedForm, this.form,this.selectedFields)
      }, error => {
        console.error("Impossible de lire le formulaire", id);
        console.error(error);
      });
    });
  }

  isValid(keyField): Boolean {
    return this.form.controls[keyField].valid;
  }
  goStop() {
    this.selectedMenu.status = "Hold";
  }
  goPause() {
    this.selectedMenu.status = "Pending";
    console.log(this.form);
  }
  goNext() {
    console.log("Save data form", this.form.controls, this.selectedForm['fields']);
    this.selectedMenu.status = "Completed";
    let fForm = [];
    for (var key in this.form.controls) {
      let question = this.form.controls[key];
      let field = this.selectedForm['fields'].filter(item => item.model === key);
      fForm.push({
        model: key,
        field: field[0]['title'],
        error: question['_errors'],
        pristine: question['_pristine'],
        status: question['_status'],
        touched: question['_touched'],
        value: question['_value']
      });
    }
    let dForm = { "form": this.selectedForm['title'], "formInput": fForm, "formState": this.selectedMenu.status };
    this.paramsApi.storeDataForms(this.selectedForm.id, dForm);
    this.loadForm(this.selectedForm.id + 1);
  }
  initField(model) {
    this.goNext();
  }
  onSubmit() { }
}



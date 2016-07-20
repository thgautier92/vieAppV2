import { Component, ViewChild, ElementRef, Input, Output, AfterViewInit, OnChanges} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';
import { FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators, AbstractControl,
  NgSwitch, NgSwitchWhen, NgSwitchDefault} from '@angular/common';
import {groupBy, ValuesPipe, KeysPipe} from '../../pipes/common';
import {Paramsdata} from '../../providers/params-data/params-data';

/*
  Generated class for the FlexInput component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'flex-input',
  templateUrl: 'build/components/flex-input/flex-input.html',
  inputs: ['idMenu', 'dataIn'],
  outputs: ['dataOut'],
  directives: [IONIC_DIRECTIVES, FORM_DIRECTIVES, NgSwitch, NgSwitchWhen, NgSwitchDefault],
  pipes: [groupBy, ValuesPipe, KeysPipe],
  providers: [Paramsdata]
})
export class FlexInput implements AfterViewInit, OnChanges {
  menuCurrent: any = {};
  form: any;
  selectedForm: any;
  selectedFields: any;
  @Input() idMenu: any;
  @Input() dataIn: any;
  constructor(private fb: FormBuilder, private paramsApi: Paramsdata) {
    this.form = this.fb.group({});
  }
  ngAfterViewInit() {
    console.log("!! Data passed to component : ",this.dataIn);
    // Get Info about menu
    this.paramsApi.loadMenu().then(menu => {
      //console.log("Menu", menu);
      this.menuCurrent = menu[this.idMenu-1];
    });
    this.paramsApi.getForm(this.idMenu, this.dataIn).then(data => {
      //console.log("== Return form data ", this.idMenu, data);
      this.form = data['formGroup'];
      this.selectedForm = data['form'];
      // Group fields array
      this.selectedFields = new groupBy().transform(this.selectedForm['fields'], 'group');
      //this.selectedMenu.status = "Started";
      //console.log("Display form", this.selectedForm, this.form, this.selectedFields)
    }, error => {
      console.error("Impossible de lire le formulaire", this.idMenu);
      console.error(error);
    });
  }
  ngOnChanges(changes: any) {
    console.log(changes);
  }
}
// ===== Validators method =====
interface ValidationResult {
  [key: string]: boolean;
}
export class ValidationService {
  static mailFormat(control: Control): ValidationResult {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
      return { "incorrectMailFormat": true };
    }
    return null;
  }
  static getValidatorErrorMessage(code: string) {
    let config = {
      'required': 'Obligatoire',
      'invalidCreditCard': 'est un numéro de carte de crédit incorrect',
      'invalidEmailAddress': 'est une adresse mail invalide',
      'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
      'invalidNumber': 'Ce nombre ne respecte pas les limtes imposées.'
    };
    return config[code];
  }
  static creditCardValidator(control: any) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
      return null;
    } else {
      return { 'invalidCreditCard': true };
    }
  }
  static numberFormat(control: Control, numLimit?: Array<number>): ValidationResult {
    console.log("Bornes : ", numLimit);
    if (numLimit) {
      if (control.value < numLimit[0] || control.value > numLimit[1]) {
        return { "incorrectNumberFormat": true };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  static emailValidator(control: any) {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  }
  static passwordValidator(control: any) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { 'invalidPassword': true };
    }
  }
}
// ===== End Validators method =====

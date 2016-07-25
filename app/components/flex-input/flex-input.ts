import { Component, ViewChild, ElementRef, Input, Output, AfterViewInit, OnChanges} from '@angular/core';
import {IONIC_DIRECTIVES, Platform, Events} from 'ionic-angular';
import { FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators, AbstractControl,
  NgSwitch, NgSwitchWhen, NgSwitchDefault} from '@angular/common';
import {groupBy, ValuesPipe, KeysPipe} from '../../pipes/common';
import {Paramsdata} from '../../providers/params-data/params-data';
import {Simu} from '../../providers/simu/simu';

/*
  Generated class for the FlexInput component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'flex-input',
  templateUrl: 'build/components/flex-input/flex-input.html',
  inputs: [, 'idPage', 'idMenu', 'dataIn', 'idClient'],
  directives: [IONIC_DIRECTIVES, FORM_DIRECTIVES, NgSwitch, NgSwitchWhen, NgSwitchDefault],
  pipes: [groupBy, ValuesPipe, KeysPipe],
  providers: [Paramsdata, Simu]
})
export class FlexInput implements AfterViewInit, OnChanges {
  menuCurrent: any = {};
  dataCurrent: any;
  form: any;
  selectedForm: any;
  selectedFields: any;
  dataNonInput: any = {};
  @Input() idPage: any;
  @Input() idMenu: any;
  @Input() dataIn: any;
  @Input() idClient: any;
  constructor(private platform: Platform, private fb: FormBuilder, private paramsApi: Paramsdata, private simu: Simu, private events: Events) {
    this.form = this.fb.group({});
  }
  ngAfterViewInit() {
    console.log("!! Data passed to component : ", this.idPage, this.idMenu, this.dataIn, this.idClient);
    this.loadForm(this.dataIn['clients'][this.idClient]['client']['output'][0]);
  };
  ngOnChanges(changes: any) {
    //console.log("Data Changes",changes);
    this.idClient = changes.idClient.currentValue;
    let d = {};
    if (changes['dataIn']) {
      d = changes.dataIn.currentValue;
    } else {
      d = this.dataIn;
    }
    this.loadForm(d['clients'][this.idClient]['client']['output'][0]);
  };
  /* ======================================================================
  * Create a form component with 
  *    - all fields parameters and validation control
  *    - default value , initialized from the synchronised folder
  * ======================================================================= */
  loadForm(dataForm) {
    this.dataCurrent = dataForm;
    // Get Info about menu
    this.paramsApi.loadMenu().then(menu => {
      this.menuCurrent = menu[this.idMenu - 1];
    });
    //console.log("Data to inject in form",dataForm);
    this.paramsApi.getForm(this.idMenu, dataForm).then(data => {
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
  // Validation form
  diagNext(formStatus, evt) {
    //console.log("Save data form", this.form.controls, this.selectedForm['fields']);
    //console.log("Click event",evt);
    this.menuCurrent.status = formStatus;
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
    let dForm = { form: this.selectedForm['title'], status: formStatus, formInput: fForm, extraData:this.dataNonInput };
    this.dataIn['rdv']['resultByClient'][this.idClient]['forms'][this.selectedForm.id] = dForm;
    this.events.publish('rdvSave', this.dataIn);
    this.events.publish('rdvStatus_' + this.idPage, { idPage: this.idPage, form: this.selectedForm, status: formStatus });
  }
  openSimu(url) {
    console.log("Open url", url);
    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };
    window.open(url, "_system");
    /*
    this.platform.ready().then(() => {
      cordova.InAppBrowser.open(url, "_system", options);
    });
    */
  }
  openSimuData(idx, field, url) {
    let me=this
    console.log("OPEN SIMU WITH DATA:", idx, field, url);
    this.simu.callSimu({ rdvId: 10, dataIn: this.dataCurrent }).then(function (data) {
      url = data['urlNext'];
      me.dataNonInput['idSimu'] = data['insert_id'];
      let idField = idx;
      var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'yes'
      };
      window.open(url, "_system");
    });
  }
  onSubmit() {
    //console.log("Submit Form", this.form);
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

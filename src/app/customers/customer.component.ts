import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms';

import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerForm: FormGroup; // our template will bind to this property
  customer = new Customer(); // DATA MODEL used in backend

  constructor() { }

  ngOnInit() { // instance of FormGroup created when the form is initialized
    this.customerForm = new FormGroup({ // FORM MODEL used in ui
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      sendCatalog: new FormControl(true) // set the default value for that form input
    });
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }
}

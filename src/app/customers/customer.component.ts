import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerForm: FormGroup; // our template will bind to this property
  customer = new Customer(); // DATA MODEL used in backend

  constructor(private fb: FormBuilder) { }

  ngOnInit() { // instance of FormGroup created when the form is initialized
    // this.customerForm = new FormGroup({ // FORM MODEL used in ui
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   email: new FormControl(),
    //   sendCatalog: new FormControl(true) // set the default value for that form input
    // });
    this.customerForm = this.fb.group({
      firstName: '',
      lastName: '',
      email: '',
      sendCatalog: true
    });
  }

  populateTestData(): void {
    this.customerForm.patchValue({ //setValue
      firstName: 'Jack',
      lastName: 'Hard',
      sendCatalog: false
    });
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }
}

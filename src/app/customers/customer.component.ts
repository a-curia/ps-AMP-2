import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { Customer } from './customer';

import { debounceTime } from 'rxjs/operators'



  // custom form validator function
// function ratingRange(c: AbstractControl): { [key:string]: boolean } | null {
//   if ( c.value != null && (isNaN(c.value) || c.value < 1 || c.value > 5) ) {
//     return { 'range': true }; // range is the validation rule name
//   }
//   return null; // if the form is valid we return null
// }

// facotry function which can accept parameters and wraps up the validator function
function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if ( c.value != null && (isNaN(c.value) || c.value < min || c.value > max) ) {
      return { 'range': true }; // range is the validation rule name
    }
    return null; // if the form is valid we return null
  };
}

function emailMatcher(c: AbstractControl): {[key: string]: boolean} | null {
  const emailControl = c.get('email');
  const confirmlControl = c.get('confirmEmail');

  if (emailControl.pristine || confirmlControl.pristine) {
    return null;
  }
  if (emailControl.value === confirmlControl.value) {
    return null;
  }
  return {'match': true}; // the key is the name of the validation rule; true tells to add this error to the error collection for the FormGroup
  // adds the broken validation rule name to the errors collection for the formGroup, not the individual Form Controls
}


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerForm: FormGroup; // our template will bind to this property
  customer = new Customer(); // DATA MODEL used in backend

  emailMessage: string; // message displayed to the user
  private validationMessages = { // possible messages
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit() { // instance of FormGroup created when the form is initialized
    // this.customerForm = new FormGroup({ // FORM MODEL used in ui
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   email: new FormControl(),
    //   sendCatalog: new FormControl(true) // set the default value for that form input
    // });
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: {value: 'n/a', disabled: true},
      emailGroup: this.fb.group({
        email: ['',[Validators.required, Validators.email]],
        confirmEmail:['', Validators.required]
      }, {validator: emailMatcher}),
      phone: '',
      notification: 'email',
      rating: [null, ratingRange(1, 5)],
      sendCatalog: [true]
    });

    this.customerForm.get('notificaiton').valueChanges.subscribe( // subscribe to FormControl to watch for changes
      // we can
      //- adjust validation rules
      //- handle validation messages
      //- modify user interface elements
      //- provide automatic suggestions
      //- ... unlimited possibilities
      value => this.setNotification(value)
    );

    // watcher on the email input
    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges
    .pipe(debounceTime(1000)) // 1 second without typeing and after we do the validation
    .subscribe(
      value => this.sendMessage(emailControl)
    );
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

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }

    phoneControl.updateValueAndValidity();

  }

  sendMessage(c: AbstractControl): void { // method take as param a FormGroup or FormControl
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(key => this.emailMessage += this.validationMessages[key]).join(' ');
    }

  }



}

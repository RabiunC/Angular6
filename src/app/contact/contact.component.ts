import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { FeedbackService } from '../services/feedback.service';
import { flyInOut, expand } from '../animations/app.animations';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbackcopy: Feedback;
  contactType = ContactType;
  errMess : string;
  @ViewChild('fform') feedbackFormDirective;
  public divForm: boolean;
  public divSpin: boolean;
  public divSubmit: boolean; 

  fName: string;
  lName: string;
  telNo: number;
  email: string;
  agree: boolean;
  contacttye: string;
  message: string;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  constructor( private feedbackservice: FeedbackService,
    private fb: FormBuilder,
    @Inject('baseURL') private baseURL ) {
         this.createForm();
   }

  ngOnInit() {
    this.divForm = true;
    this.divSpin = false;
    this.divSubmit = false;
  }
 
  createForm(){
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }   

  onSubmit() {

    this.divForm = false;
    this.divSpin = true;

    this.feedback = this.feedbackForm.value;
    //console.log(this.feedback);
    this.feedbackcopy = this.feedbackForm.value;
   
    this.feedbackservice.submitFeedback(this.feedbackcopy)
      .subscribe(feedback => {
        this.feedback = feedback; this.feedbackcopy = feedback;

        //wait 5 Seconds and hide
        setTimeout(function() {
                    }, 5000);       
          
          //console.log(this.feedbackcopy);
              this.divSpin = false;
              this.divSubmit = true;

              this.fName = this.feedbackcopy.firstname;
              this.lName = this.feedbackcopy.lastname;
              this.telNo = this.feedbackcopy.telnum;
              this.email = this.feedbackcopy.email;
              this.agree = this.feedbackcopy.agree;
              this.contacttye = this.feedbackcopy.contacttype;
              this.message = this.feedbackcopy.message;
              
              setTimeout(function() {
                location.reload();               
              }, 5000);
                          
      },
      errmess => { this.feedback = null; this.feedbackcopy = null; this.errMess = <any>errmess; });    
    
    this.feedbackForm.reset();
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }

}

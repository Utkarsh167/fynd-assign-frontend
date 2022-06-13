import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { messages } from '../messages'

@Component({
  selector: 'ms-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  public form: FormGroup ;
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  passwordRegex = /^(.{8,})/
  message: any;
  // details: { email: any; password: any; };

  constructor(private fb: FormBuilder, public router: Router,
    // private _snackBar: MatSnackBar,
    // private toastr: ToastrService,
    public apiService: ApiService) { }

  login(userData: any) {
    this.apiService.signInUser(userData).subscribe(result => {
      if (result.status == "success") {
        let userData = result.data;
        
       
        let details = JSON.stringify(userData)
        localStorage.setItem("endUser", details);
        
        if (userData.userType == 'admin') {
          this.router.navigate(["/admin/home"]);
        }
      } else {
        if (result.data.invalidEmail) {
          this.form.controls['email'].setErrors({ 'invalidEmail': true })
        } else if (result.data.invalidPassword) {

          this.form.controls['password'].setValue('');
          this.form.controls['password'].markAsUntouched();
          this.form.controls['password'].setErrors({ 'invalidPassword': true });
        } else if (result.data.accountNotVerified) {
          this.form.controls['email'].markAsUntouched();
          this.form.controls['email'].setErrors({ 'accountNotVerified': true })
        }
        else if (result.data.userNotActive) {
          this.form.controls['email'].markAsUntouched();
          this.form.controls['email'].setErrors({ 'userNotActive': true })
        }
        else {
          this.form.controls['email'].markAsUntouched();
          this.form.controls['email'].setErrors({ 'invalidEmail': false })
        }
      }

    }, (err:any) => {
      console.log(err)
      this.router.navigate(["/error/404"])
    })
  }

  ngOnInit() {
    localStorage.setItem('pageType', 'admin')
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.pattern(this.emailRegex)])],
      password: [null, Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.pattern(this.passwordRegex)])],

    });
    this.message = messages
    // this.details = history.state.data;
   
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').toString().match(/\s/g)
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

 

  // openSnackBar(message: string, action: string) {
  //   this._snackBar.open(message, action, {
  //     duration: 10000,
  //   });
  // }
  
}

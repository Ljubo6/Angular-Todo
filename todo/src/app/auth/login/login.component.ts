import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  errorMessage!:string
  submitted = false
  message!:string
  constructor(public authService:AuthService,
              private toastr: ToastrService,
              protected route: ActivatedRoute) {}

  async onSubmit(formValue:any) {

    this.submitted = true
    const user = {
      email: formValue.email,
      password:formValue.password
    }
    await this.authService.signin(user).then(() => {
      this.submitted = false
    }).catch((error) => {
      this.submitted = false
    })

  }

  ngOnInit(): void {

  }
}

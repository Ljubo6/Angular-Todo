import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {AuthSecondService} from "../../service/auth-second.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private authSecondService:AuthSecondService) {
  }

  async onSubmit(formValue:any) {
    await this.authSecondService.signin(formValue.email,formValue.password)
  }
}

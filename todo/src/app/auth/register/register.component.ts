import { Component } from '@angular/core';
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private authService:AuthService) {
  }
  async onSubmit(formValue:any) {
    await this.authService.signup(formValue.email,formValue.password)
  }
}

import { Component } from '@angular/core';
import {AuthSecondService} from "../../service/auth-second.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private authSecondService:AuthSecondService) {
  }
  async onSubmit(formValue:any) {
    await this.authSecondService.signup(formValue.email,formValue.password)
  }
}

import { Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-navbar-second',
  templateUrl: './navbar-second.component.html',
  styleUrls: ['./navbar-second.component.css']
})
export class NavbarSecondComponent implements OnInit{
  isSignedIn:boolean
  email:string
  constructor(public firebaseService: AuthService) {
    this.isSignedIn = false
    this.email = ''

    this.firebaseService.isLoggedIn$.subscribe((isLoggedIn:boolean) => {
      this.isSignedIn = isLoggedIn
      console.log(this.isSignedIn)
      if (isLoggedIn){
        const user = JSON.parse(localStorage.getItem('user')!)
        this.email = user?.email
        console.log(this.email)

      }else{
        this.email = ''
      }
    })


  }

  onLogOut():void {
    this.firebaseService.logout()
  }

  ngOnInit(): void {
  }
}

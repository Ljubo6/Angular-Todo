import { Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
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

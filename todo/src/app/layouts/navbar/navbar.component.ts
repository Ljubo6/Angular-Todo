import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{


  userEmail$!:Observable<string>
  isLoggedIn$!:Observable<boolean>
  isSignIn!:boolean
  email:string = ''
  constructor(protected authService:AuthService,
              private router:Router) {
  }
  ngOnInit(): void {



    // this.user = JSON.parse(localStorage.getItem('user')!)
    // this.userEmail = this.user?.email
    this.userEmail$ = this.authService.loggedInEmail()
    // this.userEmail$.subscribe(email => {
    //   this.email = email
    //   console.log(this.email)
    // })
    //this.email = JSON.parse(localStorage.getItem('user')!)?.email
    this.isLoggedIn$ = this.authService.isLoggedIn()
    // this.isLoggedIn$.subscribe(res => {
    //   this.isSignIn = res
    //   console.log(this.isSignIn)
    // })

  }

  onLogOut() {

    this.authService.logOut()
  }
}

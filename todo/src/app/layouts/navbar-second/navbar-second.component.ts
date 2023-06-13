import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthSecondService} from "../../service/auth-second.service";

@Component({
  selector: 'app-navbar-second',
  templateUrl: './navbar-second.component.html',
  styleUrls: ['./navbar-second.component.css']
})
export class NavbarSecondComponent implements OnInit{
  isSignedIn:boolean
  email:string
  constructor(private firebaseService: AuthSecondService) {
    this.isSignedIn = false
    this.email = ''

    this.firebaseService.isLoggedIn$.subscribe((isLoggedIn:boolean) => {
      this.isSignedIn = isLoggedIn
      if (isLoggedIn){
        const user = JSON.parse(localStorage.getItem('user')!)
        this.email = user?.email
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

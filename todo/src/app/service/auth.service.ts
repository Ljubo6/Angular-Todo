import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  isLoggedInGuard:boolean = false

  userEmail:BehaviorSubject<string> = new BehaviorSubject<string>('')

  constructor(private afAuth:AngularFireAuth,
              private toastr:ToastrService,
              private router: Router
  ) {
    this.checkLoginStatus();
    this.loadUser()
  }

  checkLoginStatus() {
    const loggedInStatus = localStorage.getItem('loggedIn');
    if (loggedInStatus === 'true') {
      this.loggedIn.next(true);
    }
  }

  login(email:string,password:string){
    this.afAuth.signInWithEmailAndPassword(email,password).then(logRef => {
      this.toastr.success('Logged In Successfully')

      this.loggedIn.next(true)
      // this.loadUser()
      sessionStorage.setItem('loggedIn', 'true')
      this.isLoggedInGuard = true
      this.router.navigate(['/category'])
    }).catch(e => {
      this.toastr.warning(e)
    })
  }
  loadUser(){
    this.afAuth.authState.subscribe(user => {

      //localStorage.setItem('user',JSON.stringify(user))
      //localStorage.setItem('user',JSON.stringify(user))
      //sessionStorage.setItem('loggedIn', 'true')

      //this.userEmail.next(JSON.parse(localStorage.getItem('user')!)?.email)




     //sessionStorage.setItem('loggedInEmail',this.userEmail.value)

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        const userEmail = user.email || '';
        this.userEmail.next(userEmail);
      } else {
        localStorage.removeItem('user');
        this.userEmail.next('');
      }
    })
  }
  logOut(){
    this.afAuth.signOut().then(() =>{
      this.toastr.success('User Logged Out Successfully')

      this.loggedIn.next(false)
      this.isLoggedInGuard = false
      localStorage.removeItem('user')
      sessionStorage.clear()

      this.router.navigate(['/login'])
    })
  }
  isLoggedIn(){
    const savedLoggedIn = sessionStorage.getItem('loggedIn');
    this.loggedIn.next(savedLoggedIn === 'true');
    return this.loggedIn.asObservable()
  }
  loggedInEmail(){
    // const savedUserEmail = sessionStorage.getItem('loggedInEmail')
    // this.userEmail.next(savedUserEmail!);
    return this.userEmail.asObservable()
  }
}

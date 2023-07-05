import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword
} from '@angular/fire/auth'
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  expiresIn: string = ''

  public isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;
  isLoggedInGuard: boolean = false
  constructor(
              private auth: Auth,
              private toastr: ToastrService,
              private router: Router
  ) {
    this.isLoggedInSubject = new BehaviorSubject<boolean>(false);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();

    this.checkAuthenticationStatus();

  }

  private checkAuthenticationStatus() {
    const user = JSON.parse(localStorage.getItem('user')!);
    const isLoggedIn = user !== null;
    this.isLoggedInSubject.next(isLoggedIn);
  }
  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp')!)
    if (new Date > expDate) {
      this.logout()
      return null!
    }
    return localStorage.getItem('token')!

  }
  public setToken(response: any) {
    if (response) {
      const expDate = new Date(new Date().getTime() + Number(this.expiresIn) * 1000)
      localStorage.setItem('user', JSON.stringify(response.user))
      //localStorage.setItem('token', response.user['stsTokenManager'].accessToken)
      //localStorage.setItem('token', response["_tokenResponse"].idToken)
      localStorage.setItem('token', response.user.accessToken)
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else {
      localStorage.clear()
    }
  }
  isAuthenticated(): boolean {
    return !!this.token
  }
  async signin(user: any) {
    await signInWithEmailAndPassword(this.auth, user.email, user.password)
      .then((response: any) => {
        this.expiresIn = response["_tokenResponse"].expiresIn
        console.log(response)
        this.setToken(response)
        this.isLoggedInSubject.next(true);
        this.toastr.success('Login success')
        this.router.navigate(['/category'])
      })
      .catch((error) => {
        const errorCode = error.code
        if (errorCode === 'auth/wrong-password') {
          this.toastr.error('Wrong password')
        } else if (errorCode === 'auth/user-not-found') {
          this.toastr.error('User with this email do not exist')
        }
      })

  }
  async signup(email: string, password: string) {
    await createUserWithEmailAndPassword(this.auth, email, password)
      .then((response) => {
        this.toastr.success('Register success')
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        const errorCode = error.code
        if (errorCode === 'auth/email-already-in-use') {
          this.toastr.error('User with this email already exist')
        }
      })
  }
  logout() {
    signOut(this.auth).then(() => {
      this.isLoggedInSubject.next(false);
      this.isLoggedInGuard = false
      localStorage.removeItem('user');
      localStorage.removeItem('fb-token-exp');
      localStorage.removeItem('token');
      localStorage.removeItem('originalId');
      this.router.navigate(['/login']);
    }).catch(e => {
      this.toastr.warning(e);
    });
  }
}



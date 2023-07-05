import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import {Auth,signInWithEmailAndPassword} from "@angular/fire/auth"
import {BehaviorSubject, catchError, Observable, ObservableInput, Subject, tap, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthSecondService {
  public isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;
  isLoggedInGuard:boolean = false
  public error$: Subject<string> = new Subject<string>()


  constructor(private firebaseAuth: AngularFireAuth,
              private toastr: ToastrService,
              private router: Router,
              private auth:Auth,
              private http:HttpClient) {
    this.isLoggedInSubject = new BehaviorSubject<boolean>(false);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();

    // Проверка при инициализация на AuthSecondService
    this.checkAuthenticationStatus();
  }
  get token():string {
    const expDate = new Date(localStorage.getItem('fb-token-exp')!)
    if(new Date > expDate){
      this.logout()
      return null!
    }
    return localStorage.getItem('user')!

  }
  isAuthenticated():boolean{
    return !!this.token
  }
  signin(user:any):Observable<any> {
    // try {
    //   const signInMethods = await this.firebaseAuth.fetchSignInMethodsForEmail(email);
    //   if (signInMethods.length === 0) {
    //     this.toastr.warning('User with this email do not exists');
    //   } else {
    //     console.log(signInMethods.length)
    //     await this.firebaseAuth.signInWithEmailAndPassword(email, password).then(res => {
    //       localStorage.setItem('user', JSON.stringify(res.user))
    //       this.isLoggedInSubject.next(true);
    //       this.toastr.success('Logged In Successfully');
    //       this.isLoggedInGuard = true
    //       this.router.navigate(['/category']);
    //     }).catch((error) => {
    //       if (error.code  === 'auth/wrong-password'){
    //         this.toastr.warning('Invalid password')
    //       }
    //
    //     })
    //   }
    // } catch (error) {
    //
    //   this.toastr.warning('An error occurred during signup');
    //   console.log(error);
    // }


    // await this.firebaseAuth.signInWithEmailAndPassword(email, password).then(res => {
    //   localStorage.setItem('user', JSON.stringify(res.user))
    //   this.isLoggedInSubject.next(true);
    //   this.toastr.success('Logged In Successfully');
    //   this.isLoggedInGuard = true
    //   this.router.navigate(['/category']);
    // }).catch((error) => {
    //   // if (error.code  === 'auth/wrong-password'){
    //   //   this.toastr.warning('Invalid password')
    //   // }
    //   this.toastr.warning(error)
    //   catchError(this.handleError.bind(this))
    // })
    // signInWithEmailAndPassword(this.auth,user.email,user.password).then(res => {
    //     localStorage.setItem('user', JSON.stringify(res.user))
    //     this.isLoggedInSubject.next(true);
    //     this.toastr.success('Logged In Successfully');
    //     this.isLoggedInGuard = true
    //     this.router.navigate(['/category']);
    //   }).catch((error) => {
    //     // if (error.code  === 'auth/wrong-password'){
    //     //   this.toastr.warning('Invalid password')
    //     // }
    //     this.toastr.warning(error)
    //     catchError(this.handleError.bind(this))
    // })
    user.returnSecureToken = true
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`,user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this)),

      )

  }
  public setToken(response: any){
    if(response) {
      const expDate = new Date(new Date().getTime() + Number(response.expiresIn) * 1000)
      localStorage.setItem('user', JSON.stringify(response))
      localStorage.setItem('token',response.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString())
    }else{
      localStorage.clear()
    }
  }

  private handleError(error: HttpErrorResponse): ObservableInput<any>{
    const {message} = error.error.error
    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Invalid email')
        break
      case 'INVALID_PASSWORD':
        this.error$.next('Wrong password')
        break
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Email not found')
        break

    }
    return throwError(() => error)
  }
  async signup(email: string, password: string) {
    try {
      const signInMethods = await this.firebaseAuth.fetchSignInMethodsForEmail(email);
      if (signInMethods.length > 0) {
        this.toastr.warning('User with this email already exists');
      } else {
        await this.firebaseAuth.createUserWithEmailAndPassword(email, password);
        this.toastr.success('Signed Up Successfully');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      this.toastr.warning('An error occurred during signup');
      console.log(error);
    }
  }

  logout() {
    this.firebaseAuth.signOut().then(() => {
      this.isLoggedInSubject.next(false);
      //this.toastr.success('User Logged Out Successfully');
      this.isLoggedInGuard = false
      localStorage.removeItem('user');
      localStorage.removeItem('fb-token-exp');
      localStorage.removeItem('token');

      this.router.navigate(['/login']);
    }).catch(e => {
      this.toastr.warning(e);
    });
  }

  private checkAuthenticationStatus() {
    const user = JSON.parse(localStorage.getItem('user')!);
    const isLoggedIn = user !== null;
    this.isLoggedInSubject.next(isLoggedIn);
  }
}

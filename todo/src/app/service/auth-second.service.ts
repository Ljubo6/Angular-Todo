import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthSecondService {
  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;
  isLoggedInGuard:boolean = false

  constructor(private firebaseAuth: AngularFireAuth, private toastr: ToastrService, private router: Router) {
    this.isLoggedInSubject = new BehaviorSubject<boolean>(false);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();

    // Проверка при инициализация на AuthSecondService
    this.checkAuthenticationStatus();
  }

  async signin(email: string, password: string) {
    try {
      const signInMethods = await this.firebaseAuth.fetchSignInMethodsForEmail(email);
      if (signInMethods.length === 0) {
        this.toastr.warning('User with this email do not exists');
      } else {
        await this.firebaseAuth.signInWithEmailAndPassword(email, password).then(res => {
          localStorage.setItem('user', JSON.stringify(res.user))
          this.isLoggedInSubject.next(true);
          this.toastr.success('Logged In Successfully');
          this.isLoggedInGuard = true
          this.router.navigate(['/category']);
        }).catch((error) => {
          this.toastr.warning('Invalid password')
        })
      }
    } catch (error) {
      this.toastr.warning('An error occurred during signup');
      console.log(error);
    }
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
      this.toastr.success('User Logged Out Successfully');
      this.isLoggedInGuard = false
      localStorage.removeItem('user');

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

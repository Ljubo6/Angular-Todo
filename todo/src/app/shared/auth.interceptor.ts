import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse, HttpParams
} from '@angular/common/http';


import {catchError, Observable, tap, throwError} from 'rxjs';
import {Router} from "@angular/router";
import {AuthService} from "../service/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isSignedIn:boolean

  constructor(private auth: AuthService, private router: Router) {
    this.isSignedIn = false

    this.auth.isLoggedIn$.subscribe((isLoggedIn:boolean) => {
      this.isSignedIn = isLoggedIn
    })
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(this.isSignedIn){
      req = req.clone({
        // setParams:{
        //   auth: this.auth.token!
        // }
        setHeaders:{
          Authorization: `Bearer ${this.auth.token}`
        }
      })
    }
    return next.handle(req)
      .pipe(
        tap(() => {
          console.log('Interceptor')
        }),
        catchError((error: HttpErrorResponse):Observable<any>=> {
          console.log('[Interceptor Error]:',error)
          if(error.status === 401 || error.status === 403){
            this.auth.logout()
            this.router.navigate(['/login'],{
              queryParams:{
                authFailed: true
              }
            })
          }
          return throwError(() => error)
        })
      )
  }
}

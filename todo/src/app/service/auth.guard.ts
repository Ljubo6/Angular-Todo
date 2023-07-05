import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';

import {ToastrService} from "ngx-toastr";
import {AuthService} from "./auth.service";
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isSignedIn:boolean = false
  userId!:string
  constructor(private authService:AuthService,
              private router:Router,
              private toastr: ToastrService) {
    this.authService.isLoggedIn$.subscribe((isLoggedIn:boolean) => {
      this.isSignedIn = isLoggedIn
      if (isLoggedIn){
        this.userId = JSON.parse(localStorage.getItem('user')!).uid
      }
    })
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()){
      return of(true)
    }else{
      this.authService.logout()
      this.toastr.warning("You dont have permission to access this page...")
      this.router.navigate(['/login'],{
        queryParams:{
          accessDenied:true
        }
      })
      return of(false)
    }
  }
}

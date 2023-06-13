import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';

import {ToastrService} from "ngx-toastr";
import {AuthSecondService} from "./auth-second.service";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isSignedIn:boolean = false
  constructor(private authSecondService:AuthSecondService,
              private router:Router,
              private firebaseService: AuthSecondService,
              private toastr: ToastrService) {
    this.firebaseService.isLoggedIn$.subscribe((isLoggedIn:boolean) => {
      this.isSignedIn = isLoggedIn
    })
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isSignedIn){
      console.log('Access Granted')
      return of(true)
    }else{
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

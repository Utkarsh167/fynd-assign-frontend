import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../_services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(private router: Router, private apiService: ApiService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let loggedIn = this.apiService.isUserLoggedIn()
    if (!loggedIn) {
      this.apiService.userLogout()
      return false;
    } else {
      return true;
    }
  }
  
}

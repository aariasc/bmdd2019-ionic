import {Injectable} from '@angular/core';
import {CanLoad, Route, UrlSegment, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private router: Router, private userService: UserService) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    const isUserLoggedIn = this.userService.isUserAuthenticated;
    console.log('isUserLoggedIn?', isUserLoggedIn);
    if (!isUserLoggedIn) {
      this.router.navigateByUrl('/login');
    }
    return isUserLoggedIn;
  }
}

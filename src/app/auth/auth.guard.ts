
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from "@angular/router"
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";


/*        GUARD se dodaje na  ROUTER    */
/* IF YOU WANT TO IMPLENET SERVICES INTO SERVICES - WE HAVE TO ADD @Injectable */
@Injectable()
export class AuthGuard  implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();
    if (!isAuth) {
      this.router.navigate(['/login'])
    }
      return isAuth;
  }
}


/*                           WE ADD THIS GUARD IN APP-ROUTING MODULE                          */
/*                     THERE WE ATTACH IT TO WHICH ROUTES WE WANT TO GUARD                    */

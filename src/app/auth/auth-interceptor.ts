import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";


@Injectable()       // *** this service uses another service (Auth)
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {       // obavezna metoda... npr kao ngOnInit() // has to have 2 arguments // <any> - means it attaches to ALL requests
    const authToken = this.authService.getToken();

    const authRequest = req.clone({    // we clone the request because that is the way to manipulate them // to avoid some sidefects
      headers: req.headers.set('Authorization', "Bearer " + authToken)     // 'Authorization' - zbog toha sto se na bekend middleware-u zove "req.headres.authorization"
    });
    return next.handle(authRequest);   // handle method provided on next // we allow request to continue its journey
  }                                      // WE PASS THE CLONED REQUEST
}


/*

    WE ADD THIS MIDDLEWARE IN APP.MODULE.TS       -----> PROVIDERS

    provide: HTTP_INTERCEPTORS,     -- klasa koju izbacujemo i ubacujemo nasu klasu
    useClass: AuthInterceptor     -- nasa klasa
    multi: true                     --  moze vise intercepotra za redom
*/

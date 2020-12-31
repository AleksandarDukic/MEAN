import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwToolbarMixedModesError } from "@angular/material/toolbar";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorComponent } from "./error/error.component";

@Injectable()     // zato sto hocemo da koristimo neki "service" u ovoj komponenti - zato Injectable - matDialog
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {} // for dialog - we need a component to use it as a content

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(                           // .handle(req) gives us the RESPONSE observable stream. we use pipe to add operator to that stream!!!!
      catchError((error: HttpErrorResponse) =>{
        let errorMessage = "An unknown error occured!";
        if (error.error.message){
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
        return throwError(error)            // we have to keep in mind that we are just adding something to that observable stream
      })                                   // we are handling it in different places of our app
    );                                      // we MUST return an Observable -- and that is "throwError"
  }
}


/*
  Every outgoing http request will be watched
  if we get an error response this should kick in
*/

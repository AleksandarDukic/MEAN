import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import {environment} from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/user";


@Injectable({
  providedIn: "root"
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private userId: string;
  private tokenTimer: NodeJS.Timer /* !!!!!!!!!!!!  OVAKO ANGULAR OMOGUCAVA DA SE KORISTE TAJMERI */
  private authStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable()         // we can only emit from this service, but we can listen(observe) from other parts of app
  }

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password}
    this.http
      .post(
        BACKEND_URL +'/signup',
        authData)
        .subscribe((response) => {
          console.log(response)
          this.router.navigate(["/"]);
        }, error => {
          this.authStatusListener.next(false);
        });
  }


  /* !!!!               gets called in --- APP.COMPONENT.TS                 !!!!   */
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if(!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true)
    }
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password}
    this.http.post<{token: string, expiresIn: number, userId: string}>(
      BACKEND_URL + "/login",
      authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          /* making expiration date: */
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          /* ----------------------- */
          this.saveAuthData(token, expirationDate, this.userId)
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);          /* !!!!!!!!! Clearing the TIMER */
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString())      /* ISOstrin da bi datum mogao da se re-create kad se jednom sejvuje  --- sjevuje Date po grinicu izgleda */
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId")
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

  private setAuthTimer(duration: number) {
    console.log("setting timer" + duration)
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000)  // works in miliseconds
  }

}

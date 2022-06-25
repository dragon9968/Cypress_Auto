import { Injectable } from '@angular/core';
import * as NgxCookieService from 'ngx-cookie-service';
import { CookieKeys } from 'src/app/enums/storage/cookie-keys.enum';
import { CookieData } from 'src/app/models/storage/cookie-data.model';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  constructor(private ngxCookieServices: NgxCookieService.CookieService) {}

  getCookie<T extends CookieKeys>(name: T, encoded = true): CookieData[T] {
    let cookie = this.ngxCookieServices.get(name);

    if (encoded) {
      cookie = this.decodeCookie<T>(cookie);
    }

    return cookie;
  }

  setCookie<T extends CookieKeys>(
    name: T,
    value: CookieData[T],
    encode = true
  ) {
    let cookie = value;

    if (encode) {
      cookie = this.encodeCookie<T>(cookie);
    }

    this.ngxCookieServices.set(name, cookie);
  }

  private encodeCookie<T extends CookieKeys>(cookie: CookieData[T]): string {
    let encodedCookie = JSON.stringify(cookie);

    encodedCookie = btoa(encodedCookie);

    return encodedCookie;
  }

  private decodeCookie<T extends CookieKeys>(
    encodedCookie: string
  ): CookieData[T] {
    let decodedCookie: string = atob(encodedCookie);

    decodedCookie = JSON.parse(encodedCookie);

    return (decodedCookie as unknown) as CookieData[T];
  }
}

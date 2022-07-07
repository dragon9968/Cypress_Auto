import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  private version = new ReplaySubject<string>(1);

  version$ = this.version.asObservable();

  constructor() {
    const version = environment.version;

    this.version.next(version);
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VersionService } from './version/version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  environment = environment;
  version$: Observable<string> | undefined;

  constructor(private versionService: VersionService) {}

  ngOnInit() {
    this.version$ = this.versionService.version$;
  }
}

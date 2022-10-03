import { Component, OnInit } from '@angular/core';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  routeSegments = RouteSegments;
  constructor() { }

  ngOnInit(): void {
    
  }

}

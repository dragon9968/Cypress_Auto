import { Component, OnInit, ViewEncapsulation } from '@angular/core';
declare var jQuery: any;

/* Can use Javascript too */
function changeh4() {
  const h4 = <HTMLElement>document.getElementById("testP");
  h4.textContent = "Changed by using Javascript.";
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  showTerms: Boolean = false;
  constructor() { }

  ngOnInit(): void {
    /* Can use jQuery too */
    (function ($) {
      $(document).ready(function () {
        console.log("Hello from jQuery!");
        $("h1").text("THIS IS JUST A LANDING PAGE");
        $("h6").text("Changed by using jQuery");
      });
    })(jQuery);
    changeh4();
  }
}

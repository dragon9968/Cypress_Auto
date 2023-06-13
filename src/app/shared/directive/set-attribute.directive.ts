import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[disableAutoFill]'
})
export class SetAttributeDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setAttribute(this.el.nativeElement, 'data-lpignore', 'true');
  }

}

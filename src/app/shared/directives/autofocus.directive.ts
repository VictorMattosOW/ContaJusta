import { AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[appAutofocus]',
    standalone: false
})
export class AutofocusDirective implements AfterViewInit, OnChanges {
  @Input() appAutofocus = true;
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    if (this.appAutofocus) {
      this.el.nativeElement.focus();
    }
  }

  ngOnChanges(): void {
    if (this.appAutofocus) {
      this.el.nativeElement.focus();
    }
  }
}

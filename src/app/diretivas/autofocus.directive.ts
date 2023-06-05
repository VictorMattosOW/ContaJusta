import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit{

  constructor(
    private el: ElementRef,
    private cd: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    this.cd.detectChanges();
    setTimeout(() => {
      this.el.nativeElement.focus();
    });
  }

}

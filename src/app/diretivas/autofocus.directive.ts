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
    setTimeout(() => {
      this.el.nativeElement.focus();
    });
    this.cd.detectChanges();
  }

}

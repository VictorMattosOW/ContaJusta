import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { AutofocusDirective } from './autofocus.directive';

// Componente host para testar a directive
@Component({
  template: '<input [appAutofocus]="true" />'
})
class TestHostComponent {}

describe('AutofocusDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent, AutofocusDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    // NÃO chamar detectChanges aqui
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.children[0].injector.get(AutofocusDirective);
    expect(directive).toBeTruthy();
  });

  it('should focus the element on init', () => {
    const input = fixture.nativeElement.querySelector('input');
    spyOn(input, 'focus');

    fixture.detectChanges(); // agora sim: spy já existe, focus() é capturado

    expect(input.focus).toHaveBeenCalled();
  });
});

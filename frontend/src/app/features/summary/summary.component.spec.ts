import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SummaryComponent } from './summary.component';

// Stub: ngOnInit redireciona p/ 'registrar' quando a lista está vazia,
// então o teste precisa dessa rota registrada
@Component({ template: '' })
class RegistrarStub {}

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryComponent], // standalone vai em imports, nunca em declarations
      providers: [provideRouter([{ path: 'registrar', component: RegistrarStub }])]
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

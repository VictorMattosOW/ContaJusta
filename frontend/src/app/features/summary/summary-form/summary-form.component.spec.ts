import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryFormComponent } from './summary-form.component';
import { createSummaryForm } from './summary-form-factory';

describe('SummaryFormComponent', () => {
  let component: SummaryFormComponent;
  let fixture: ComponentFixture<SummaryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('form', createSummaryForm());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

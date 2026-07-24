import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { TooltipComponent } from './tooltip.component';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TooltipComponent],
      imports: [CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.showTooltip).toBeFalse();
    expect(component.content).toBe('');
    expect(component.numberOfUsers).toBe(0);
  });

  it('should display "+0" by default', () => {
    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toContain('+0');
  });

  it('should display "+N" with custom numberOfUsers', () => {
    component.numberOfUsers = 3;
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toContain('+3');
  });

  it('should NOT show tooltip when showTooltip is false', () => {
    component.showTooltip = false;
    fixture.detectChanges();

    const tooltip = fixture.nativeElement.querySelector('.tooltip');
    expect(tooltip).toBeNull();
  });

  it('should show tooltip when showTooltip is true', () => {
    component.showTooltip = true;
    component.content = 'João, Maria';
    fixture.detectChanges();

    const tooltip = fixture.nativeElement.querySelector('.tooltip');
    expect(tooltip).toBeTruthy();
  });

  it('should display content inside tooltip', () => {
    component.showTooltip = true;
    component.content = 'João, Maria';
    fixture.detectChanges();

    const tooltipText = fixture.nativeElement.querySelector('.tooltiptext');
    expect(tooltipText.textContent).toContain('João, Maria');
  });

  it('should show "+N" and tooltip together', () => {
    component.numberOfUsers = 2;
    component.showTooltip = true;
    component.content = 'Ana, Carlos';
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.title');
    const tooltip = fixture.nativeElement.querySelector('.tooltip');

    expect(title.textContent).toContain('+2');
    expect(tooltip).toBeTruthy();
    expect(tooltip.querySelector('.tooltiptext').textContent).toContain('Ana, Carlos');
  });
});

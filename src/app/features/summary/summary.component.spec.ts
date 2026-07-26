import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SummaryComponent } from './summary.component';
import { UserNamesDisplayPipe } from 'app/shared/pipes/user-names-display.pipe';
import { SessionService } from 'app/shared/services/session.service';
import { of } from 'rxjs';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SummaryComponent, UserNamesDisplayPipe],
      imports: [CurrencyPipe, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: SessionService, useValue: { getOrdersObservable: () => of([]) } }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

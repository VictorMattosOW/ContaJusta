import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderUserDisplayComponent } from './order-user-display.component';

describe('OrderUserDisplayComponent', () => {
  let component: OrderUserDisplayComponent;
  let fixture: ComponentFixture<OrderUserDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderUserDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderUserDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

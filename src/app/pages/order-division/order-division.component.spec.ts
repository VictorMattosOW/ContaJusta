import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDivisionComponent } from './order-division.component';

describe('OrderDivisionComponent', () => {
  let component: OrderDivisionComponent;
  let fixture: ComponentFixture<OrderDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDivisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserNamesPipe } from 'app/shared/pipes/user-names.pipe';
import { UserNamesDisplayPipe } from 'app/shared/pipes/user-names-display.pipe';
import { TooltipComponent } from 'app/shared/components/tooltip/tooltip.component';

import { OrderUserDisplayComponent } from './order-user-display.component';

describe('OrderUserDisplayComponent', () => {
  let component: OrderUserDisplayComponent;
  let fixture: ComponentFixture<OrderUserDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderUserDisplayComponent, UserNamesPipe, UserNamesDisplayPipe, TooltipComponent]
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemsQuantityComponent } from './items-quantity.component';

describe('ItemsQuantityComponent', () => {
  let component: ItemsQuantityComponent;
  let fixture: ComponentFixture<ItemsQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsQuantityComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

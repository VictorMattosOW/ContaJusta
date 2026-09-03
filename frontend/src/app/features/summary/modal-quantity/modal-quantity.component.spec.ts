import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalQuantityComponent } from './modal-quantity.component';

describe('ModalQuantityComponent', () => {
  let component: ModalQuantityComponent;
  let fixture: ComponentFixture<ModalQuantityComponent>;

  // jsdom não implementa <dialog>.showModal()/close() — mock mínimo
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal ??= jest.fn();
    HTMLDialogElement.prototype.close ??= jest.fn();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalQuantityComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

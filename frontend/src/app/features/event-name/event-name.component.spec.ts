import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EventNameComponent } from './event-name.component';
import { OrderService } from '../order/services/order.service';

describe('EventNameComponent', () => {
  let component: EventNameComponent;
  let fixture: ComponentFixture<EventNameComponent>;
  let routerMock: { navigate: jest.Mock };
  let orderService: OrderService;

  beforeEach(async () => {
    routerMock = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [EventNameComponent],
      providers: [{ provide: Router, useValue: routerMock }, OrderService]
    }).compileComponents();

    fixture = TestBed.createComponent(EventNameComponent);
    component = fixture.componentInstance;
    orderService = TestBed.inject(OrderService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('mantém submit desabilitado enquanto o nome está vazio', () => {
    expect(component.canSubmit()).toBe(false);
  });

  it('salva o nome (sem espaços) e navega para a tela inicial', () => {
    const setEventNameSpy = jest.spyOn(orderService, 'setEventName');

    component.form.controls.eventName.setValue('  churrasco do João  ');
    fixture.detectChanges();

    expect(component.canSubmit()).toBe(true);

    component.submit();

    expect(setEventNameSpy).toHaveBeenCalledWith('churrasco do João');
    expect(routerMock.navigate).toHaveBeenCalledWith(['']);
  });
});

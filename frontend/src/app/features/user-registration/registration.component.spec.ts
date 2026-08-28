import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationComponent } from './registration.component';
import { User } from 'app/core/models/user.model';
import { signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/shared/services/user/user.service';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

  let routerMock: { navigate: jest.Mock };
  // let routeMock: { snapshot: { params: Record<string, string> } };
  let usersSignal: WritableSignal<User[]>;
  let userServiceMock: {
    users$: ReturnType<WritableSignal<User[]>['asReadonly']>;
    addUser: jest.Mock;
    removeUser: jest.Mock;
    updateUser: jest.Mock;
    resetUser: jest.Mock;
  };

  const userA: User = { id: '1', name: 'Ana' };

  const createComponent = () => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    routerMock = { navigate: jest.fn() };
    // routeMock = { snapshot: { params: {} } };
    usersSignal = signal<User[]>([userA]);
    userServiceMock = {
      users$: usersSignal.asReadonly(),
      addUser: jest.fn(),
      removeUser: jest.fn(),
      updateUser: jest.fn(),
      resetUser: jest.fn()
    };
    // const usersSignal = signal<User[]>([userA]);

    await TestBed.configureTestingModule({
      imports: [RegistrationComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();
  });

  it.only('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });
});

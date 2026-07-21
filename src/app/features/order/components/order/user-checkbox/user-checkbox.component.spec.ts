import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCheckboxComponent } from './user-checkbox.component';

describe('UserCheckboxComponent', () => {
  let component: UserCheckboxComponent;
  let fixture: ComponentFixture<UserCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCheckboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

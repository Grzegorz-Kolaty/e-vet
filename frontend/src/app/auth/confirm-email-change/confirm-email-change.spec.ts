import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEmailChange } from './confirm-email-change';

describe('ConfirmEmailChange', () => {
  let component: ConfirmEmailChange;
  let fixture: ComponentFixture<ConfirmEmailChange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmEmailChange]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailChange);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

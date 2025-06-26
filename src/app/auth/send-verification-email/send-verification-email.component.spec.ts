import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendVerificationEmailComponent } from './send-verification-email.component';

describe('SendVerificationEmailComponent', () => {
  let component: SendEmailVerificationComponent;
  let fixture: ComponentFixture<SendEmailVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendEmailVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendEmailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAppointmentsComponent } from './create-appointments.component';

describe('CreateAppointmentsComponent', () => {
  let component: CreateAppointmentsComponent;
  let fixture: ComponentFixture<CreateAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAppointmentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetUpcomingAppointments } from './pet-upcoming-appointments';

describe('PetUpcomingAppointments', () => {
  let component: PetUpcomingAppointments;
  let fixture: ComponentFixture<PetUpcomingAppointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetUpcomingAppointments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetUpcomingAppointments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

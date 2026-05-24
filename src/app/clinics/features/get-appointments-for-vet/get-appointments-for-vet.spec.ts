import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAppointmentsForVet } from './get-appointments-for-vet';

describe('GetAppointmentsForVet', () => {
  let component: GetAppointmentsForVet;
  let fixture: ComponentFixture<GetAppointmentsForVet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAppointmentsForVet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAppointmentsForVet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

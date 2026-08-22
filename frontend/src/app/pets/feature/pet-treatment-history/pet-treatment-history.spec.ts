import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetTreatmentHistory } from './pet-treatment-history';

describe('PetTreatmentHistory', () => {
  let component: PetTreatmentHistory;
  let fixture: ComponentFixture<PetTreatmentHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetTreatmentHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetTreatmentHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

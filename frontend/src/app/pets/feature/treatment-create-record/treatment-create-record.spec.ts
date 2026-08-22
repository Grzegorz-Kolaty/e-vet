import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentCreateRecord } from './treatment-create-record';

describe('TreatmentCreateRecord', () => {
  let component: TreatmentCreateRecord;
  let fixture: ComponentFixture<TreatmentCreateRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentCreateRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatmentCreateRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

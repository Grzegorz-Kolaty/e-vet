import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentAttachments } from './treatment-attachments.component';

describe('TreatmentDocuments', () => {
  let component: TreatmentAttachments;
  let fixture: ComponentFixture<TreatmentAttachments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentAttachments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatmentAttachments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

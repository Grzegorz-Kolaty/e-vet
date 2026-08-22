import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClinicForm } from './create-clinic-form';

describe('CreateClinicForm', () => {
  let component: CreateClinicForm;
  let fixture: ComponentFixture<CreateClinicForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClinicForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateClinicForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

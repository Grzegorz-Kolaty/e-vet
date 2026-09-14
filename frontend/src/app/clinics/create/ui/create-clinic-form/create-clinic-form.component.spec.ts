import { ComponentFixture, TestBed } from '@angular/core/testing';

import {CreateClinicFormComponent} from './create-clinic-form.component';

describe('CreateClinicFormComponent', () => {
  let component: CreateClinicFormComponent;
  let fixture: ComponentFixture<CreateClinicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClinicFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateClinicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

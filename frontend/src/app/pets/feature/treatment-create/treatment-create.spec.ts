import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TreatmentCreateComponent} from './treatment-create';

describe('TreatmentCreateComponent', () => {
  let component: TreatmentCreateComponent;
  let fixture: ComponentFixture<TreatmentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TreatmentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

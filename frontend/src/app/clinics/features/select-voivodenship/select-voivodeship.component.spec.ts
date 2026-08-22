import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectVoivodeship } from './select-voivodeship.component';

describe('SelectVoivodeship', () => {
  let component: SelectVoivodeship;
  let fixture: ComponentFixture<SelectVoivodeship>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectVoivodeship]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectVoivodeship);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

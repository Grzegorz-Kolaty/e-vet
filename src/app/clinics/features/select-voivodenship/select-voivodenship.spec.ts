import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectVoivodenship } from './select-voivodenship';

describe('SelectVoivodenship', () => {
  let component: SelectVoivodenship;
  let fixture: ComponentFixture<SelectVoivodenship>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectVoivodenship]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectVoivodenship);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

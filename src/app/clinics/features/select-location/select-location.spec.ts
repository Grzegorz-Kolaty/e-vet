import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLocation } from './select-location';

describe('SelectLocation', () => {
  let component: SelectLocation;
  let fixture: ComponentFixture<SelectLocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectLocation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectLocation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

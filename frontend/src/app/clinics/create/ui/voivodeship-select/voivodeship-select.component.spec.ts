import { ComponentFixture, TestBed } from '@angular/core/testing';

import {VoivodeshipSelectComponent} from './voivodeship-select.component';

describe('VoivodeshipSelectComponent', () => {
  let component: VoivodeshipSelectComponent;
  let fixture: ComponentFixture<VoivodeshipSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoivodeshipSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoivodeshipSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

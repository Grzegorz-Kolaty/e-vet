import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetNav } from './pet-nav';

describe('PetNav', () => {
  let component: PetNav;
  let fixture: ComponentFixture<PetNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

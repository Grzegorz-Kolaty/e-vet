import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetSearch } from './pet-search';

describe('PetSearch', () => {
  let component: PetSearch;
  let fixture: ComponentFixture<PetSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

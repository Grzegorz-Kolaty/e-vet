import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BrowseClinicsComponent} from './browse-clinics.component';

describe('BrowseClinicsComponent', () => {
  let component: BrowseClinicsComponent;
  let fixture: ComponentFixture<BrowseClinicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseClinicsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BrowseClinicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

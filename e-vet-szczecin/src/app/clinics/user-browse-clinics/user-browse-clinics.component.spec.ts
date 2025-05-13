import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBrowseClinicsComponent } from './user-browse-clinics.component';

describe('UserBrowseClinicsComponent', () => {
  let component: UserBrowseClinicsComponent;
  let fixture: ComponentFixture<UserBrowseClinicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBrowseClinicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBrowseClinicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

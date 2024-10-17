import {ComponentFixture, TestBed} from '@angular/core/testing';

import DashboardVetComponent from './dashboard-vet.component';

describe('DashboardVetComponent', () => {
    let component: DashboardVetComponent;
    let fixture: ComponentFixture<DashboardVetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardVetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DashboardVetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHospitalManagerComponent } from './manage-hospital-manager.component';

describe('ManageHospitalManagerComponent', () => {
  let component: ManageHospitalManagerComponent;
  let fixture: ComponentFixture<ManageHospitalManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageHospitalManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageHospitalManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

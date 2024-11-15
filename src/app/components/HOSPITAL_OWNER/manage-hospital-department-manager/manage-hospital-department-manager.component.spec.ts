import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHospitalDepartmentManagerComponent } from './manage-hospital-department-manager.component';

describe('ManageHospitalDepartmentManagerComponent', () => {
  let component: ManageHospitalDepartmentManagerComponent;
  let fixture: ComponentFixture<ManageHospitalDepartmentManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageHospitalDepartmentManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageHospitalDepartmentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

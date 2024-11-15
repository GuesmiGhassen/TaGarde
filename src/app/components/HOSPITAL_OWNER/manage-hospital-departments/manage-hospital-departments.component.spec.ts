import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHospitalDepartmentsComponent } from './manage-hospital-departments.component';

describe('ManageHospitalDepartmentsComponent', () => {
  let component: ManageHospitalDepartmentsComponent;
  let fixture: ComponentFixture<ManageHospitalDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageHospitalDepartmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageHospitalDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

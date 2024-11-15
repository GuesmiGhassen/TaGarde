import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDepartmentDoctorsComponent } from './manage-department-doctors.component';

describe('ManageDepartmentDoctorsComponent', () => {
  let component: ManageDepartmentDoctorsComponent;
  let fixture: ComponentFixture<ManageDepartmentDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageDepartmentDoctorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDepartmentDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

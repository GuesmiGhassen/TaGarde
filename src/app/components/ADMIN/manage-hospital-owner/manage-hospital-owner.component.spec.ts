import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHospitalOwnerComponent } from './manage-hospital-owner.component';

describe('ManageHospitalOwnerComponent', () => {
  let component: ManageHospitalOwnerComponent;
  let fixture: ComponentFixture<ManageHospitalOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageHospitalOwnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageHospitalOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

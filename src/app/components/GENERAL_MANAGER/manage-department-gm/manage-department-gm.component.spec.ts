import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDepartmentGMComponent } from './manage-department-gm.component';

describe('ManageDepartmentGMComponent', () => {
  let component: ManageDepartmentGMComponent;
  let fixture: ComponentFixture<ManageDepartmentGMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageDepartmentGMComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDepartmentGMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

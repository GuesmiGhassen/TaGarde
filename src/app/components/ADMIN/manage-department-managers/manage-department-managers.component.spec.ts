import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDepartmentManagersComponent } from './manage-department-managers.component';

describe('ManageDepartmentManagersComponent', () => {
  let component: ManageDepartmentManagersComponent;
  let fixture: ComponentFixture<ManageDepartmentManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageDepartmentManagersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDepartmentManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

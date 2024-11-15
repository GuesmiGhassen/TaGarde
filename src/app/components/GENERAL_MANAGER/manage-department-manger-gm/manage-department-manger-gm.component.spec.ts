import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDepartmentMangerGmComponent } from './manage-department-manger-gm.component';

describe('ManageDepartmentMangerGmComponent', () => {
  let component: ManageDepartmentMangerGmComponent;
  let fixture: ComponentFixture<ManageDepartmentMangerGmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageDepartmentMangerGmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDepartmentMangerGmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

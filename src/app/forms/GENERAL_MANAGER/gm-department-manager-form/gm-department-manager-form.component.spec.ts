import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmDepartmentManagerFormComponent } from './gm-department-manager-form.component';

describe('GmDepartmentManagerFormComponent', () => {
  let component: GmDepartmentManagerFormComponent;
  let fixture: ComponentFixture<GmDepartmentManagerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GmDepartmentManagerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GmDepartmentManagerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

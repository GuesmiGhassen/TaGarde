import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentManagerFormComponent } from './department-manager-form.component';

describe('DepartmentManagerFormComponent', () => {
  let component: DepartmentManagerFormComponent;
  let fixture: ComponentFixture<DepartmentManagerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepartmentManagerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentManagerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

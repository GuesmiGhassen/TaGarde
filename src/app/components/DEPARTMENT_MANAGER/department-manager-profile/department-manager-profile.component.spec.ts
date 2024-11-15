import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentManagerProfileComponent } from './department-manager-profile.component';

describe('DepartmentManagerProfileComponent', () => {
  let component: DepartmentManagerProfileComponent;
  let fixture: ComponentFixture<DepartmentManagerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepartmentManagerProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentManagerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

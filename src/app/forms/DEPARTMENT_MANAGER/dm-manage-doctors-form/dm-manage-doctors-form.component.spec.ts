import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmManageDoctorsFormComponent } from './dm-manage-doctors-form.component';

describe('DmManageDoctorsFormComponent', () => {
  let component: DmManageDoctorsFormComponent;
  let fixture: ComponentFixture<DmManageDoctorsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DmManageDoctorsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmManageDoctorsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

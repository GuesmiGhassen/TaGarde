import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDoctorsDmComponent } from './manage-doctors-dm.component';

describe('ManageDoctorsDmComponent', () => {
  let component: ManageDoctorsDmComponent;
  let fixture: ComponentFixture<ManageDoctorsDmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageDoctorsDmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDoctorsDmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

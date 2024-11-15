import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectHospitalComponent } from './select-hospital.component';

describe('SelectHospitalComponent', () => {
  let component: SelectHospitalComponent;
  let fixture: ComponentFixture<SelectHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectHospitalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

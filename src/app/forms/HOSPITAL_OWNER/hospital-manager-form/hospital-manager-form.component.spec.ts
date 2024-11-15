import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalManagerFormComponent } from './hospital-manager-form.component';

describe('HospitalManagerFormComponent', () => {
  let component: HospitalManagerFormComponent;
  let fixture: ComponentFixture<HospitalManagerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HospitalManagerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalManagerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

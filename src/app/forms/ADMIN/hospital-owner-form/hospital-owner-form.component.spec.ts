import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalOwnerFormComponent } from './hospital-owner-form.component';

describe('HospitalOwnerFormComponent', () => {
  let component: HospitalOwnerFormComponent;
  let fixture: ComponentFixture<HospitalOwnerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HospitalOwnerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalOwnerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

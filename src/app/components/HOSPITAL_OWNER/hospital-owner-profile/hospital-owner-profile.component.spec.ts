import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalOwnerProfileComponent } from './hospital-owner-profile.component';

describe('HospitalOwnerProfileComponent', () => {
  let component: HospitalOwnerProfileComponent;
  let fixture: ComponentFixture<HospitalOwnerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HospitalOwnerProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalOwnerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

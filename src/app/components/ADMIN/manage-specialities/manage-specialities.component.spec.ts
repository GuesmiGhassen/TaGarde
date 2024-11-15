import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSpecialitiesComponent } from './manage-specialities.component';

describe('ManageSpecialitiesComponent', () => {
  let component: ManageSpecialitiesComponent;
  let fixture: ComponentFixture<ManageSpecialitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageSpecialitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSpecialitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

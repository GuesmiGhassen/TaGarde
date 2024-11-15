import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGeneralManagersComponent } from './manage-general-managers.component';

describe('ManageGeneralManagersComponent', () => {
  let component: ManageGeneralManagersComponent;
  let fixture: ComponentFixture<ManageGeneralManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageGeneralManagersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageGeneralManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralManagerProfileComponent } from './general-manager-profile.component';

describe('GeneralManagerProfileComponent', () => {
  let component: GeneralManagerProfileComponent;
  let fixture: ComponentFixture<GeneralManagerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralManagerProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralManagerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

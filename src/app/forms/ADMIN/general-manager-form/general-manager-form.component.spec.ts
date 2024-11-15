import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralManagerFormComponent } from './general-manager-form.component';

describe('GeneralManagerFormComponent', () => {
  let component: GeneralManagerFormComponent;
  let fixture: ComponentFixture<GeneralManagerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralManagerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralManagerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

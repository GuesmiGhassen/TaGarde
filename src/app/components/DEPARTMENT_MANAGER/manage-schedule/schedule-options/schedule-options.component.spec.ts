import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleOptionsComponent } from './schedule-options.component';

describe('ScheduleOptionsComponent', () => {
  let component: ScheduleOptionsComponent;
  let fixture: ComponentFixture<ScheduleOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

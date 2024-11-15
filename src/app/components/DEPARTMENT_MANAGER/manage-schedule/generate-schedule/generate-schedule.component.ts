import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule, DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ScheduleService } from '../../../../service/DEPARTMENT_MANAGER/schedule.service';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-schedule',
  templateUrl: './generate-schedule.component.html',
  styleUrl: './generate-schedule.component.scss',
  standalone: true,
  imports: [CommonModule, ListboxModule, ReactiveFormsModule, CalendarModule, DropdownModule, CardModule, FullCalendarModule, FormsModule, ButtonModule],
  providers: [DatePipe]
})
export class GenerateScheduleComponent {
  scheduleForm: FormGroup;
  holidayError: boolean = false;
  schedules: any[] = [];
  generatedSchedules: any[] = [];
  months: { name: string; value: number }[] = [];
  selectedSchedule: any | null = null;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: []
  };
  holidays: Date[] = [];

  constructor(private fb: FormBuilder, private scheduleService: ScheduleService, private datePipe: DatePipe, private router: Router) {
    this.scheduleForm = this.fb.group({
      month: ['', Validators.required],
      holidays: [[]]
    });
  }

  ngOnInit(): void {
    this.initializeMonths();
    this.scheduleService.generate().forEach(rep => {
      console.log("Test",rep.data);
    })
    this.calendarOptions.events = this.formatEvents(this.sampleSech);
  }
  initializeMonths() {
    this.months = [
      { name: 'January', value: 1 },
      { name: 'February', value: 2 },
      { name: 'March', value: 3 },
      { name: 'April', value: 4 },
      { name: 'May', value: 5 },
      { name: 'June', value: 6 },
      { name: 'July', value: 7 },
      { name: 'August', value: 8 },
      { name: 'September', value: 9 },
      { name: 'October', value: 10 },
      { name: 'November', value: 11 },
      { name: 'December', value: 12 }
    ];
  }
  formatEvents(schedule: any[]): any[] {
    return schedule.flatMap(item =>
      item.doctorScheduleDTOs.map((dto: any) => ({
        title: `Doctor ${dto.doctorId}`,
        date: dto.workday,
        extendedProps: {
          id: dto.id,
          doctorId: dto.doctorId
        }
      }))
    );
  }
  validateHolidaysForMonth(month: number, holidays: Date[]): boolean {
    if (!holidays) {
      return true;
    }
    const monthStart = new Date(new Date().getFullYear(), month - 1, 1);
    const monthEnd = new Date(new Date().getFullYear(), month, 0);

    return holidays.every(date => date >= monthStart && date <= monthEnd);
  }
  
  onGenerate() {
    const { month, holidays } = this.scheduleForm.value;

    if (this.scheduleForm.valid) {
      if (this.validateHolidaysForMonth(month.value, holidays)) {
        this.holidayError = false;
        const formattedHolidays = this.proses(holidays.map((date: string) => new Date(date)));
        console.log('Formatted Holidays:', formattedHolidays);
        this.router.navigate(['/department-manager/ScheduleOptions'])
        // Proceed with generating schedules
        // this.scheduleService.generateSchedules(month.value, formattedHolidays).subscribe(schedules => {
        //   // Handle the schedules response
        // });
      } else {
        this.holidayError = true;
      }
    }
  }
  onScheduleSelected(schedule : string){

  }
  // onGenerate() {
  //   if (this.scheduleForm.valid) {
  //     const { month, holidays } = this.scheduleForm.value;
  //     this.scheduleService.generateSchedules(month, holidays).subscribe(schedules => {
  //       this.schedules = schedules;
  //       this.selectedSchedule = null;
  //     });
  //   }
  // }

  onSelectSchedule(schedule: any) {
    this.selectedSchedule = schedule;
    this.displaySchedule(schedule);
  }
  public proses(dates: Date[] | null): string[] {
    if (dates && dates.length > 0) {
      return dates.map(date => this.datePipe.transform(date, 'yyyy-MM-dd') || '');
    } else {
      return [];
    }
  }

  displaySchedule(schedule: any) {
    // const events = schedule.doctors.map((doctor: any) => ({
    //   title: doctor.name,
    //   start: doctor.shiftStart,
    //   end: doctor.shiftEnd,
    //   color: doctor.color // Assuming the API returns a color for each doctor
    // }));

    // this.calendarOptions = {
    //   ...this.calendarOptions,
    //   events
    // };
  }
  sampleSech = [
    {
      id: 1,
      month: '2024-12',
      hospitaDepartmentId: 1,
      doctorScheduleDTOs: [
        { id: 0, workday: '2024-12-01', doctorId: '1' },
        { id: 1, workday: '2024-12-05', doctorId: '2' },
        { id: 2, workday: '2024-12-10', doctorId: '3' }
      ]
    },
    {
      id: 2,
      month: '2024-12',
      hospitaDepartmentId: 1,
      doctorScheduleDTOs: [
        { id: 0, workday: '2024-12-02', doctorId: '2' },
        { id: 1, workday: '2024-12-06', doctorId: '3' },
        { id: 2, workday: '2024-12-11', doctorId: '1' }
      ]
    },
    {
      id: 3,
      month: '2024-12',
      hospitaDepartmentId: 1,
      doctorScheduleDTOs: [
        { id: 0, workday: '2024-12-03', doctorId: '3' },
        { id: 1, workday: '2024-12-07', doctorId: '1' },
        { id: 2, workday: '2024-12-12', doctorId: '2' }
      ]
    }
  ];
}

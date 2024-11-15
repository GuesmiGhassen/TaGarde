import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-schedule-options',
  templateUrl: './schedule-options.component.html',
  styleUrl: './schedule-options.component.scss',
  standalone: true,
  imports: [DialogModule, CarouselModule, CalendarModule, ButtonModule, FullCalendarModule, FormsModule],
  providers: [DatePipe]
})
export class ScheduleOptionsComponent {
  scheduleOptionsMap: Map<number, CalendarOptions> = new Map();
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    initialDate: new Date('2024-12-01'),
    events: [],
    eventClassNames: '',
    eventContent: ''
  };
  doctorColorMap: Map<string, string> = new Map();

  constructor(private router: Router) {
    this.initializeDoctorColors();
    this.schedules.forEach(schedule => {
      this.scheduleOptionsMap.set(schedule.id, this.updateCalendarOptions(schedule));
    });
  }

  schedules = [
    {
      id: 1,
      month: "2024-12",
      hospitalDepartmentId: 1,
      doctorScheduleDTOs: [
        { id: 0, workday: "2024-12-01", doctorId: "3" },
        { id: 1, workday: "2024-12-02", doctorId: "1" },
        { id: 2, workday: "2024-12-03", doctorId: "2" },
        { id: 3, workday: "2024-12-04", doctorId: "4" },
        { id: 4, workday: "2024-12-05", doctorId: "3" },
        { id: 5, workday: "2024-12-06", doctorId: "2" },
        { id: 6, workday: "2024-12-07", doctorId: "1" },
        { id: 7, workday: "2024-12-08", doctorId: "4" },
        { id: 8, workday: "2024-12-09", doctorId: "3" },
        { id: 9, workday: "2024-12-10", doctorId: "1" },
        { id: 10, workday: "2024-12-11", doctorId: "2" },
        { id: 11, workday: "2024-12-12", doctorId: "4" },
        { id: 12, workday: "2024-12-13", doctorId: "3" },
        { id: 13, workday: "2024-12-14", doctorId: "2" },
        { id: 14, workday: "2024-12-15", doctorId: "1" },
        { id: 15, workday: "2024-12-16", doctorId: "4" },
        { id: 16, workday: "2024-12-17", doctorId: "3" },
        { id: 17, workday: "2024-12-18", doctorId: "2" },
        { id: 18, workday: "2024-12-19", doctorId: "1" },
        { id: 19, workday: "2024-12-20", doctorId: "4" },
        { id: 20, workday: "2024-12-21", doctorId: "3" },
        { id: 21, workday: "2024-12-22", doctorId: "2" },
        { id: 22, workday: "2024-12-23", doctorId: "4" },
        { id: 23, workday: "2024-12-24", doctorId: "3" },
        { id: 24, workday: "2024-12-25", doctorId: "1" },
        { id: 25, workday: "2024-12-26", doctorId: "2" },
        { id: 26, workday: "2024-12-27", doctorId: "4" },
        { id: 27, workday: "2024-12-28", doctorId: "3" },
        { id: 28, workday: "2024-12-29", doctorId: "2" },
        { id: 29, workday: "2024-12-30", doctorId: "1" },
        { id: 30, workday: "2024-12-31", doctorId: "4" }
      ]
    },
    {
      id: 2,
      month: "2024-12",
      hospitalDepartmentId: 1,
      doctorScheduleDTOs: [
        { id: 0, workday: "2024-12-01", doctorId: "2" },
        { id: 1, workday: "2024-12-02", doctorId: "3" },
        { id: 2, workday: "2024-12-03", doctorId: "1" },
        { id: 3, workday: "2024-12-04", doctorId: "4" },
        { id: 4, workday: "2024-12-05", doctorId: "3" },
        { id: 5, workday: "2024-12-06", doctorId: "2" },
        { id: 6, workday: "2024-12-07", doctorId: "1" },
        { id: 7, workday: "2024-12-08", doctorId: "4" },
        { id: 8, workday: "2024-12-09", doctorId: "3" },
        { id: 9, workday: "2024-12-10", doctorId: "1" },
        { id: 10, workday: "2024-12-11", doctorId: "2" },
        { id: 11, workday: "2024-12-12", doctorId: "4" },
        { id: 12, workday: "2024-12-13", doctorId: "3" },
        { id: 13, workday: "2024-12-14", doctorId: "1" },
        { id: 14, workday: "2024-12-15", doctorId: "2" },
        { id: 15, workday: "2024-12-16", doctorId: "4" },
        { id: 16, workday: "2024-12-17", doctorId: "3" },
        { id: 17, workday: "2024-12-18", doctorId: "1" },
        { id: 18, workday: "2024-12-19", doctorId: "2" },
        { id: 19, workday: "2024-12-20", doctorId: "4" },
        { id: 20, workday: "2024-12-21", doctorId: "3" },
        { id: 21, workday: "2024-12-22", doctorId: "1" },
        { id: 22, workday: "2024-12-23", doctorId: "2" },
        { id: 23, workday: "2024-12-24", doctorId: "4" },
        { id: 24, workday: "2024-12-25", doctorId: "3" },
        { id: 25, workday: "2024-12-26", doctorId: "1" },
        { id: 26, workday: "2024-12-27", doctorId: "2" },
        { id: 27, workday: "2024-12-28", doctorId: "4" },
        { id: 28, workday: "2024-12-29", doctorId: "3" },
        { id: 29, workday: "2024-12-30", doctorId: "1" },
        { id: 30, workday: "2024-12-31", doctorId: "2" }
      ]
    },
    {
      id: 3,
      month: "2024-12",
      hospitalDepartmentId: 1,
      doctorScheduleDTOs: [
        { id: 0, workday: "2024-12-01", doctorId: "1" },
        { id: 1, workday: "2024-12-02", doctorId: "3" },
        { id: 2, workday: "2024-12-03", doctorId: "4" },
        { id: 3, workday: "2024-12-04", doctorId: "2" },
        { id: 4, workday: "2024-12-05", doctorId: "1" },
        { id: 5, workday: "2024-12-06", doctorId: "3" },
        { id: 6, workday: "2024-12-07", doctorId: "4" },
        { id: 7, workday: "2024-12-08", doctorId: "2" },
        { id: 8, workday: "2024-12-09", doctorId: "1" },
        { id: 9, workday: "2024-12-10", doctorId: "3" },
        { id: 10, workday: "2024-12-11", doctorId: "4" },
        { id: 11, workday: "2024-12-12", doctorId: "2" },
        { id: 12, workday: "2024-12-13", doctorId: "1" },
        { id: 13, workday: "2024-12-14", doctorId: "3" },
        { id: 14, workday: "2024-12-15", doctorId: "4" },
        { id: 15, workday: "2024-12-16", doctorId: "2" },
        { id: 16, workday: "2024-12-17", doctorId: "1" },
        { id: 17, workday: "2024-12-18", doctorId: "3" },
        { id: 18, workday: "2024-12-19", doctorId: "4" },
        { id: 19, workday: "2024-12-20", doctorId: "2" },
        { id: 20, workday: "2024-12-21", doctorId: "1" },
        { id: 21, workday: "2024-12-22", doctorId: "3" },
        { id: 22, workday: "2024-12-23", doctorId: "4" },
        { id: 23, workday: "2024-12-24", doctorId: "2" },
        { id: 24, workday: "2024-12-25", doctorId: "1" },
        { id: 25, workday: "2024-12-26", doctorId: "3" },
        { id: 26, workday: "2024-12-27", doctorId: "4" },
        { id: 27, workday: "2024-12-28", doctorId: "2" },
        { id: 28, workday: "2024-12-29", doctorId: "1" },
        { id: 29, workday: "2024-12-30", doctorId: "3" },
        { id: 30, workday: "2024-12-31", doctorId: "4" }
      ]
    }
  ];
  
  
  updateCalendarOptions(schedule: any): CalendarOptions {
    this.calendarOptions = {
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      initialDate: this.getDefaultDate(schedule),
      events: this.getDoctorScheduleEvents(schedule.doctorScheduleDTOs),
      headerToolbar: {
        left: 'prev,next today',
        center: '',
        right: ''
      }
    };
    return this.calendarOptions;
  }
  
  getDoctorScheduleEvents(doctorScheduleDTOs: any[]): any[] {
    return doctorScheduleDTOs.map(schedule => {
      const doctorId = schedule.doctorId;
      const color = this.doctorColorMap.get(doctorId) || 'defaultColor';
      return {
        title: `Doctor ID: ${doctorId}`,
        start: schedule.workday,
        color: color
      };
    });
  }
  onSelectSchedule(schedule: any): void {
    console.log(schedule);
    sessionStorage.setItem('SelectedSchedule',JSON.stringify(schedule));
    this.router.navigate(['/department-manager/Schedule']);
  }

  initializeDoctorColors(): void {
    const colors = ['#58508C', '#24A8FA', '#618661', '#9788f5', '#7ed1ed', '#75b83b', '#b9aff8', '#9ed3ce', '#bcdc49', '#24A8FA'];
    let colorIndex = 0;

    this.schedules.forEach(schedule => {
      schedule.doctorScheduleDTOs.forEach(dto => {
        if (!this.doctorColorMap.has(dto.doctorId)) {
          this.doctorColorMap.set(dto.doctorId, colors[colorIndex % colors.length]);
          colorIndex++;
        }
      });
    });
    const mapArray = Array.from(this.doctorColorMap.entries());
    sessionStorage.setItem('DoctorsColor', JSON.stringify(mapArray));
  }
  
  getDefaultDate(schedule: any): Date {
    return new Date(schedule.month + '-01');
  }

}
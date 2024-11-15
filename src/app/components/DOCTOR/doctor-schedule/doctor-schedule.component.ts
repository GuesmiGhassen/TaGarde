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
import { AuthService } from '../../../auth/auth.service';
interface DoctorScheduleDTO {
  id: number;
  workday: string;
  doctorId: string;
}
@Component({
  selector: 'app-doctor-schedule',
  templateUrl: './doctor-schedule.component.html',
  styleUrl: './doctor-schedule.component.scss',
  standalone: true,
  imports: [DialogModule, CarouselModule, CalendarModule, ButtonModule, FullCalendarModule, FormsModule],
})
export class DoctorScheduleComponent {
  SelectedSchedule: any;
  doctorColorMap = new Map<string, string>;
  doctorIds: string[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    initialDate: new Date('2024-12-01'),
    events: [],
    eventClassNames: '',
    eventContent: ''
  };
  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.LoadSchedule();
    this.updateCalendarOptions();
  }

  LoadSchedule() {
    const storedScheduleData = sessionStorage.getItem('SelectedSchedule');
    if (storedScheduleData) {
      this.SelectedSchedule = JSON.parse(storedScheduleData);
    }else{
      // this.router.navigate(['/department-manager/GenerateSchedule']);
    }
    console.log(this.SelectedSchedule)
  }
  updateCalendarOptions(): CalendarOptions {
    if (this.SelectedSchedule) {
      this.calendarOptions = {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        initialDate: this.getDefaultDate(this.SelectedSchedule),
        events: this.getDoctorScheduleEvents(this.SelectedSchedule.doctorScheduleDTOs),
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        }
      };
    }
    return this.calendarOptions;
  }
  getDoctorScheduleEvents(doctorScheduleDTOs: any[]): any[] {
    const user = this.auth.getCurrentUser()?.firstName;
    return doctorScheduleDTOs
      .map(schedule => {
        return {
          title: `${user}`,
          start: schedule.workday
        };
      });
  }

  getDefaultDate(schedule: any): Date {
    return new Date(schedule.month + '-01');
  }
}

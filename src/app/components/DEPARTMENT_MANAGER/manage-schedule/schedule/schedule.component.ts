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
interface DoctorScheduleDTO {
  id: number;
  workday: string;
  doctorId: string;
}
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
  standalone: true,
  imports: [DialogModule, CarouselModule, CalendarModule, ButtonModule, FullCalendarModule, FormsModule],
})
export class ScheduleComponent {
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
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.LoadSchedule();
    this.GetColors();
    this.updateCalendarOptions();
    this.extractDoctorIds();
  }

  LoadSchedule() {
    const storedScheduleData = sessionStorage.getItem('SelectedSchedule');
    if (storedScheduleData) {
      this.SelectedSchedule = JSON.parse(storedScheduleData);
    }else{
      this.router.navigate(['/department-manager/GenerateSchedule']);
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
  getDoctorScheduleEvents(doctorScheduleDTOs: any[], filterDoctorId?: string): any[] {
    return doctorScheduleDTOs
      .filter(schedule => !filterDoctorId || schedule.doctorId === filterDoctorId)
      .map(schedule => {
        const doctorId = schedule.doctorId;
        const color = this.doctorColorMap.get(doctorId) || 'defaultColor';
        return {
          title: `Doctor ID: ${doctorId}`,
          start: schedule.workday,
          color: color,
        };
      });
  }
  GetColors() {
    const storedColors = sessionStorage.getItem('DoctorsColor');
    if (storedColors) {
      const doctorColorArray = JSON.parse(storedColors);
      this.doctorColorMap = new Map<string, string>(doctorColorArray);
      console.log(this.doctorColorMap);
    } else {
      if (this.SelectedSchedule) {
        const colors = ['#58508C', '#24A8FA', '#618661', '#9788f5', '#7ed1ed', '#75b83b', '#b9aff8', '#9ed3ce', '#bcdc49', '#24A8FA'];
        let colorIndex = 0;
        this.SelectedSchedule.doctorScheduleDTOs.forEach((dto: any) => {
          if (!this.doctorColorMap.has(dto.doctorId)) {
            this.doctorColorMap.set(dto.doctorId, colors[colorIndex % colors.length]);
            colorIndex++;
          }
        });
        const mapArray = Array.from(this.doctorColorMap.entries());
        sessionStorage.setItem('DoctorsColor', JSON.stringify(mapArray));
      }
    }
  }
  extractDoctorIds() {
    if (this.SelectedSchedule) {
      // Cast the doctorScheduleDTOs to the correct type
      const doctorScheduleDTOs: DoctorScheduleDTO[] = this.SelectedSchedule.doctorScheduleDTOs as DoctorScheduleDTO[];
      this.doctorIds = [
        ...new Set(doctorScheduleDTOs.map(dto => dto.doctorId))
      ];
      console.log(this.doctorIds); // Check the extracted IDs
    }
  }
  filterByDoctor(doctorId: string) {
    this.calendarOptions.events = this.getDoctorScheduleEvents(this.SelectedSchedule.doctorScheduleDTOs, doctorId);
  }

  clearFilter() {
    this.calendarOptions.events = this.getDoctorScheduleEvents(this.SelectedSchedule.doctorScheduleDTOs);
  }
  RegenerateSchedule(){
    this.router.navigate(['/department-manager/GenerateSchedule']);
  }

  getDefaultDate(schedule: any): Date {
    return new Date(schedule.month + '-01');
  }
}

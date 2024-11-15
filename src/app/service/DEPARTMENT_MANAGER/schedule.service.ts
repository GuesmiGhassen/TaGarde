import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ApiResponse, DepartmentDTO, HospitalDepartmentDTO, HospitalDTO } from '../../models/auth.model';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ScheduleService {
    private apiUrl = `${environment.apiUrl}/schedule`;
    private storageKey: string = 'SelectedSchedule';

    constructor(private http: HttpClient, private auth: AuthService) { }

    generateSchedule(hospitalId: string, hospitalDepId: string, month: string, holidays?: string[]): Observable<ApiResponse<any>> {
        const url = `${this.apiUrl}/${hospitalId}?hospitalDepartmentId=${hospitalDepId}&month=${month}`
        if (holidays && holidays.length > 0) {
            return this.http.post<ApiResponse<any>>(url, holidays).pipe(
                tap(response => this.handleApiResponse(response)),
                catchError(this.handleError)
            );
        } else {
            return this.http.post<ApiResponse<any>>(url, null).pipe(
                tap(response => this.handleApiResponse(response)),
                catchError(this.handleError)
            );
        }
    }
    generate(): Observable<ApiResponse<any>> {
        const url = `https://run.mocky.io/v3/bec69e0d-1cb2-4149-8c0c-34172dd7cf3f`
        return this.http.post<ApiResponse<any>>(url, null).pipe(
            tap(response => this.handleApiResponse(response)),
            catchError(this.handleError)
        );
    }
    selectSchedule(hospitalId: string, hospitalDepId: string, scheduleId: string): Observable<ApiResponse<any>> {
        const url = `${this.apiUrl}/${hospitalId}/${hospitalDepId}/${scheduleId}`
        return this.http.post<ApiResponse<any>>(url, null).pipe(
            tap(response => this.handleApiResponse(response)),
            catchError(this.handleError)
        );
    }

    handleApiResponse(response: ApiResponse<any>): void {
        if (response && response.data) {
            sessionStorage.setItem(`${this.storageKey}`, JSON.stringify(response.data));
            sessionStorage.setItem('HospitalDepartments', JSON.stringify(response.data.hospitalDepartments));
        } else {
            console.warn('Response data is missing or undefined');
        }
    }

    getData(): HospitalDepartmentDTO[] | null {
        if (this.isBrowser()) {
            const storedData = sessionStorage.getItem(`HospitalDepartments`);
            if (storedData) {
                try {
                    return JSON.parse(storedData);
                } catch (error) {
                    console.error(`Error parsing stored Hospital Departments data:`, error);
                    return null;
                }
            } else {
                console.log(`No data found in sessionStorage`);
            }
        }
        return null;
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        console.error('An error occurred:', error);
        return throwError('Something went wrong, please try again later.');
    }
    private isBrowser(): boolean {
        return typeof window !== 'undefined';
    }
}
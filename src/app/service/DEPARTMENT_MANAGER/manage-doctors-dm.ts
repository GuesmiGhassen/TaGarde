import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ApiResponse, DoctorDTO, HospitalDepartmentDTO } from '../../models/auth.model';


@Injectable({
    providedIn: 'root'
})

export class ManageDoctorsDMService {
    private apiUrl = 'http://localhost:8081/api/v1/hospital';
    private storageKey: string = 'DepartmentDetails';

    constructor(private http: HttpClient) { }

    LoadDepartmentDetails(departmentId: string): Observable<ApiResponse<HospitalDepartmentDTO>> {
        return this.http.get<ApiResponse<HospitalDepartmentDTO>>(`http://localhost:8081/api/v1/hospital-department/${departmentId}`).pipe(
            tap(response => this.handleApiResponse(response)),
            catchError(this.handleError)
        );
    }
    getDepartmentDetails(): HospitalDepartmentDTO | null {
        if (this.isBrowser()) {
            const storedData = sessionStorage.getItem(`DepartmentDetails`);
            if (storedData) {
                try {
                    return JSON.parse(storedData);
                } catch (error) {
                    console.error(`Error parsing stored Department Details data:`, error);
                    return null;
                }
            } else {
                console.log(`No data found in sessionStorage`);
            }
        }
        return null;
    }
    getDoctors(): DoctorDTO[] | null {
        if (this.isBrowser()) {
            const storedData = sessionStorage.getItem(`DoctorsDetails`);
            if (storedData) {
                try {
                    return JSON.parse(storedData);
                } catch (error) {
                    console.error(`Error parsing stored Doctors data:`, error);
                    return null;
                }
            } else {
                console.log(`No data found in sessionStorage`);
            }
        }
        return null;
    }
    handleApiResponse(response: ApiResponse<HospitalDepartmentDTO>): void {
        if (response && response.data) {
            sessionStorage.setItem(`DepartmentDetails`, JSON.stringify(response.data));
            sessionStorage.setItem('DoctorsDetails', JSON.stringify(response.data.doctorsDTO));
        } else {
            console.warn('Response data is missing or undefined');
        }
    }
    delete(id: string): Observable<void> {
        const data = this.getDepartmentDetails();
        const url = `http://localhost:8081/api/v1/hospital-department/${data?.hospitalId}/hospital-departments/${data?.id}/doctor`;
        const params = new HttpParams().set('doctorId', id);
        return this.http.delete<void>(url, { params }).pipe(
            catchError(this.handleError)
        );
    }
    AssignDoctor(id: string): Observable<void> {
        const data = this.getDepartmentDetails();
        const url = `http://localhost:8081/api/v1/hospital-department/${data?.hospitalId}/hospital-departments/${data?.id}/doctor`;
        const params = new HttpParams().set('doctorId', id);
        return this.http.put<void>(url, null, { params }).pipe(
            catchError(this.handleError)
        );
    }
    create(item: DoctorDTO, role: string): Observable<ApiResponse<DoctorDTO>> {
        const params = new HttpParams().set('role', role);
        return this.http.post<ApiResponse<DoctorDTO>>(`${this.apiUrl}/auth/register`, item, { params }).pipe(
            catchError(this.handleError)
        );
    }
    updateDoctors(item: DoctorDTO, specialityId: string): Observable<ApiResponse<DoctorDTO>> {
        return this.http.put<ApiResponse<DoctorDTO>>(`${this.apiUrl}/doctor/${item.id}?specialityId=${specialityId}`, item).pipe(
            catchError(this.handleError)
        );
    }
    deleteMultiple(ids: string[]): Observable<void> {
        const data = this.getDepartmentDetails();
        const deleteRequests = ids.map(id => this.http.delete<void>(`http://localhost:8081/api/v1/hospital-department/${data?.hospitalId}/hospital-departments/${data?.id}/doctor?doctorId=${id}`));
        return forkJoin(deleteRequests).pipe(
            map(() => { }),
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        console.error('An error occurred:', error);
        return throwError(error);
    }
    private isBrowser(): boolean {
        return typeof window !== 'undefined';
    }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ApiResponse, DepartmentDTO, DoctorDTO, HospitalDepartmentDTO } from '../../models/auth.model';
import { HospitalDTO } from '../../models/auth.model';
import { AuthService } from '../../auth/auth.service';

@Injectable({
    providedIn: 'root'
})

export class HospitalDepartmentManagerService {
    private apiUrl = 'http://localhost:8081/api/v1/hospital';
    private storageKey: string = 'HospitalDetails';

    constructor(private http: HttpClient, private auth: AuthService) { }

    getHospitalById(id: string): Observable<ApiResponse<HospitalDTO>> {
        return this.http.get<ApiResponse<HospitalDTO>>(`http://localhost:8081/api/v1/hospital/${id}`).pipe(
            tap(response => this.handleApiResponse(response)),
            catchError(this.handleError)
        );
    }
    getDoctors(): Observable<ApiResponse<DepartmentDTO[]>> {
        return this.http.get<ApiResponse<DepartmentDTO[]>>(`http://localhost:8081/api/v1/department/all-users`).pipe();
    }
    getAllDepartments(): Observable<ApiResponse<DepartmentDTO[]>> {
        return this.http.get<ApiResponse<DepartmentDTO[]>>(`http://localhost:8081/api/v1/department/all-users`).pipe();
    }
    AssignDM(departmentId: string, hospitalDepartmentManagerId: string): Observable<ApiResponse<HospitalDTO>> {
        const HospitalId = this.auth.getCurrentUser()?.hospitalId || '';
        const url = `http://localhost:8081/api/v1/hospital-department/${HospitalId}/hospital-departments/${departmentId}/manager/assign?departmentManagerId=${hospitalDepartmentManagerId}`;

        return this.http.put<ApiResponse<HospitalDTO>>(url, null).pipe(
            catchError(this.handleError)
        );
    }
    handleApiResponse(response: ApiResponse<HospitalDTO>): void {
        if (response && response.data) {
            sessionStorage.setItem(`${this.storageKey}`, JSON.stringify(response.data));
            sessionStorage.setItem('HospitalDepartments', JSON.stringify(response.data.hospitalDepartments));
        } else {
            console.warn('Response data is missing or undefined');
        }
    }
    enable(id: string): Observable<void> {
        return this.http.put<void>(`http://localhost:8081/api/v1/user/status/${id}?isEnabled=true`, null).pipe(
            catchError(this.handleError)
        );
    }
    disable(id: string): Observable<void> {
        return this.http.put<void>(`http://localhost:8081/api/v1/user/status/${id}?isEnabled=false`, null).pipe(
            catchError(this.handleError)
        );
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

    create(item: DoctorDTO, role: string): Observable<ApiResponse<DoctorDTO>> {
        const params = new HttpParams().set('role', role);
        return this.http.post<ApiResponse<DoctorDTO>>(`${this.apiUrl}/auth/register`, item, { params }).pipe(
            catchError(this.handleError)
        );
    }
    Add(id: string): Observable<ApiResponse<DepartmentDTO>> {
        const HospitalId = this.auth.getCurrentUser()?.hospitalId || '';
        return this.http.post<ApiResponse<DepartmentDTO>>(`http://localhost:8081/api/v1/hospital-department/${HospitalId}/departments/${id}`, null).pipe(
            catchError(this.handleError)
        );
    }
    delete(id: string): Observable<void> {
        const HospitalId = this.auth.getCurrentUser()?.hospitalId || '';
        return this.http.delete<void>(`http://localhost:8081/api/v1/hospital-department/${HospitalId}/departments/${id}`).pipe(
            catchError(this.handleError)
        );
    }
    deleteMultiple(ids: string[]): Observable<void> {
        const HospitalId = this.auth.getCurrentUser()?.hospitalId || '';
        const deleteRequests = ids.map(id => this.http.delete<void>(`http://localhost:8081/api/v1/hospital-department/${HospitalId}/departments/${id}`));
        return forkJoin(deleteRequests).pipe(
            map(() => { }),
            catchError(this.handleError)
        );
    }
    private handleError(error: HttpErrorResponse): Observable<never> {
        console.error('An error occurred:', error);
        return throwError('Something went wrong, please try again later.');
    }
    private isBrowser(): boolean {
        return typeof window !== 'undefined';
    }
}
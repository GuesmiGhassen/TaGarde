import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ApiResponse, DepartmentDTO } from '../../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class DepartmentService {

    private apiUrl: string = 'http://localhost:8081/api/v1/department';
    private storageKey: string = 'departmentsData';

    constructor(private http: HttpClient) { }
    get(): Observable<ApiResponse<DepartmentDTO[]>> {
        return this.http.get<ApiResponse<DepartmentDTO[]>>(`${this.apiUrl}/all-users`).pipe(
            tap(response => this.handleApiResponse(response)),
            catchError(this.handleError)
        );
    }

    getById(id: string): Observable<ApiResponse<DepartmentDTO>> {
        return this.http.get<ApiResponse<DepartmentDTO>>(`${this.apiUrl}/all-users/${id}`).pipe();
    }

    getData(): DepartmentDTO[] | null {
        if (this.isBrowser()) {
            const storedData = sessionStorage.getItem(`${this.storageKey}`);
            if (storedData) {
                return this.parseData(storedData);
            } else {
                console.log(`No data found in sessionStorage`);
            }
        }
        return null;
    }

    create(item: DepartmentDTO): Observable<ApiResponse<DepartmentDTO>> {
        return this.http.post<ApiResponse<DepartmentDTO>>(`${this.apiUrl}/admin`, item).pipe(
            catchError(this.handleError)
        );
    }

    update(item: DepartmentDTO): Observable<ApiResponse<DepartmentDTO>> {
        return this.http.put<ApiResponse<DepartmentDTO>>(`${this.apiUrl}/admin/${item.id}`, item).pipe(
            catchError(this.handleError)
        );
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/admin/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    deleteMultiple(ids: string[]): Observable<void> {
        const deleteRequests = ids.map(id => this.http.delete<void>(`${this.apiUrl}/admin/${id}`));
        return forkJoin(deleteRequests).pipe(
            map(() => { }),
            catchError(this.handleError)
        );
    }

    handleApiResponse(response: ApiResponse<DepartmentDTO[]>): void {
        if (response && response.data) {
            sessionStorage.setItem(`${this.storageKey}`, JSON.stringify(response.data));
        } else {
            console.warn('Response data is missing or undefined');
        }
    }
    private parseData(storedData: string): DepartmentDTO[] | null {
        try {
            return JSON.parse(storedData);
        } catch (error) {
            console.error(`Error parsing stored ${this.storageKey} data:`, error);
            return null;
        }
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        console.error('An error occurred:', error);
        return throwError('Something went wrong, please try again later.');
    }

    private isBrowser(): boolean {
        return typeof window !== 'undefined';
    }

}

import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ApiResponse } from '../models/auth.model';
import { API_URL_TOKEN, STORAGE_KEY_TOKEN, ROLE } from './api-tokens';
import { UserRole } from '../models/auth.model';
import { AuthService } from '../auth/auth.service';

export interface Identifiable {
    id: string;
    role?: UserRole;
    isEnabled?: boolean;
}

@Injectable({
    providedIn: 'root'
})

export class UserApiService<T extends Identifiable> {
    private apiUrl: string;
    private storageKey: string;
    private ROLE: string;

    constructor(private http: HttpClient, @Inject(API_URL_TOKEN) apiUrl: string, @Inject(STORAGE_KEY_TOKEN) storageKey: string, @Inject(ROLE) role: string, private authService: AuthService) {
        this.apiUrl = apiUrl;
        this.storageKey = storageKey;
        this.ROLE = role;
    }
    get(): Observable<ApiResponse<T[]>> {
        return this.http.get<ApiResponse<T[]>>(`${this.apiUrl}/user/filter`).pipe(
            tap(response => this.handleApiResponse(response)),
            catchError(this.handleError)
        );
    }

    getData(): T[] | null {
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
    
    create(item: T, role: string): Observable<ApiResponse<T>> {
        const token = this.authService.getToken(); // Replace with your actual token retrieval method
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        console.log(headers)
        const params = new HttpParams().set('role', role);
    
        return this.http.post<ApiResponse<T>>(
            `${this.apiUrl}/auth/register`,
            item,
            { headers, params }
        ).pipe(
            catchError(this.handleError)
        );
    }
    
    
    update(item: T): Observable<ApiResponse<T>> {
        const modUrl = this.getModUrl(this.ROLE);
        console.log(modUrl)
        return this.http.put<ApiResponse<T>>(`${this.apiUrl}/${modUrl}/${item.id}`, item).pipe(
            catchError(this.handleError)
        );
    }
    updateDoctors(item: T, specialityId: string): Observable<ApiResponse<T>> {
        const modUrl = this.getModUrl(this.ROLE);
        console.log(modUrl)
        return this.http.put<ApiResponse<T>>(`${this.apiUrl}/${modUrl}/${item.id}?specialityId=${specialityId}`, item).pipe(
            catchError(this.handleError)
        );
    }

    enable(id: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/user/status/${id}?isEnabled=true`, null).pipe(
            catchError(this.handleError)
        );
    }
    disable(id: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/user/status/${id}?isEnabled=false`, null).pipe(
            catchError(this.handleError)
        );
    }

    disableMultiple(ids: string[]): Observable<void> {
        const disableRequests = ids.map(id => this.http.put<void>(`${this.apiUrl}/user/status/${id}?isEnabled=false`, null));
        return forkJoin(disableRequests).pipe(
            map(() => { }),
            catchError(this.handleError)
        );
    }

    handleApiResponse(response: ApiResponse<T[]>): void {
        if (response && response.data) {
            const filteredData = this.filterData(response.data);
            sessionStorage.setItem(`${this.storageKey}`, JSON.stringify(filteredData));
        } else {
            console.warn('Response data is missing or undefined');
        }
    }

    filterData(data: T[]): T[] {
        return data.filter(item => {
            return item.role && item.role.name === `${this.ROLE}`;
        });
    }
    // && item.isEnabled
    private parseData(storedData: string): T[] | null {
        try {
            return JSON.parse(storedData);
        } catch (error) {
            console.error(`Error parsing stored ${this.storageKey} data:`, error);
            return null;
        }
    }

    private getModUrl(role: string): string {
        switch (role) {
            case 'ROLE_GENERAL_MANAGER':
                return 'general-manager';
            case 'ROLE_HOSPITAL_OWNER':
                return 'hospital-owner';
            case 'ROLE_DOCTOR':
                return 'doctor';
            case 'ROLE_DEPARTMENT_MANAGER':
                return 'doctor';
            default:
                console.warn(`Unknown role: ${role}`);
                return 'default';
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
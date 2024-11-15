import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ApiResponse } from '../models/auth.model';
import { API_URL_TOKEN, STORAGE_KEY_TOKEN } from './api-tokens';
import { UserRole } from '../models/auth.model';

export interface Identifiable {
    id: string;
    role?: UserRole;
}

@Injectable({
    providedIn: 'root'
})

export class ApiService<T extends Identifiable> {
    private apiUrl: string;
    private storageKey: string;

    constructor(private http: HttpClient, @Inject(API_URL_TOKEN) apiUrl: string, @Inject(STORAGE_KEY_TOKEN) storageKey: string) {
        this.apiUrl = apiUrl;
        this.storageKey = storageKey;
    }

    get(): Observable<ApiResponse<T[]>> {
        return this.http.get<ApiResponse<T[]>>(`${this.apiUrl}/all-users`).pipe(
            tap(response => this.handleApiResponse(response)),
            catchError(this.handleError)
        );
    }

    getById(id: string): Observable<ApiResponse<T>> {
        return this.http.get<ApiResponse<T>>(`${this.apiUrl}/all-users/${id}`).pipe();
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

    create(item: T): Observable<ApiResponse<T>> {
        return this.http.post<ApiResponse<T>>(`${this.apiUrl}/admin`, item).pipe(
            catchError(this.handleError)
        );
    }

    update(item: T): Observable<ApiResponse<T>> {
        return this.http.put<ApiResponse<T>>(`${this.apiUrl}/admin/${item.id}`, item).pipe(
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

    handleApiResponse(response: ApiResponse<T[]>): void {
        if (response && response.data) {
            sessionStorage.setItem(`${this.storageKey}`, JSON.stringify(response.data));
        } else {
            console.warn('Response data is missing or undefined');
        }
    }

    // handleApiResponse2(response: ApiResponse<T>): void {
    //     if (response && response.data) {
    //         sessionStorage.setItem(`${this.storageKey}`, JSON.stringify(response.data));
    //     } else {
    //         console.warn('Response data is missing or undefined');
    //     }
    // }
    private parseData(storedData: string): T[] | null {
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
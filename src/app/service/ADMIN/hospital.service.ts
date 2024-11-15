import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ApiResponse, HospitalDTO } from '../../models/auth.model';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private apiUrl: string = 'http://localhost:8081/api/v1/hospital';
  private storageKey: string = 'hospitalsData';

  constructor(private http: HttpClient) { }
  get(): Observable<ApiResponse<HospitalDTO[]>> {
    return this.http.get<ApiResponse<HospitalDTO[]>>(`${this.apiUrl}`).pipe(
      tap(response => this.handleApiResponse(response)),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<ApiResponse<HospitalDTO>> {
    return this.http.get<ApiResponse<HospitalDTO>>(`${this.apiUrl}/${id}`).pipe();
  }

  getData(): HospitalDTO[] | null {
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

  create(item: HospitalDTO): Observable<ApiResponse<HospitalDTO>> {
    return this.http.post<ApiResponse<HospitalDTO>>(`${this.apiUrl}`, item).pipe(
      catchError(this.handleError)
    );
  }

  update(item: HospitalDTO): Observable<ApiResponse<HospitalDTO>> {
    return this.http.put<ApiResponse<HospitalDTO>>(`${this.apiUrl}/${item.id}`, item).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteMultiple(ids: string[]): Observable<void> {
    const deleteRequests = ids.map(id => this.http.delete<void>(`${this.apiUrl}/${id}`));
    return forkJoin(deleteRequests).pipe(
      map(() => { }),
      catchError(this.handleError)
    );
  }

  handleApiResponse(response: ApiResponse<HospitalDTO[]>): void {
    if (response && response.data) {
      sessionStorage.setItem(`${this.storageKey}`, JSON.stringify(response.data));
    } else {
      console.warn('Response data is missing or undefined');
    }
  }

  // handleApiResponse2(response: ApiResponse<HospitalDTO>): void {
  //     if (response && response.data) {
  //         sessionStorage.setItem(`${this.storageKey}`, JSON.stringify(response.data));
  //     } else {
  //         console.warn('Response data is missing or undefined');
  //     }
  // }
  private parseData(storedData: string): HospitalDTO[] | null {
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

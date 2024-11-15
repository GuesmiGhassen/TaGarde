import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { ApiResponse, GeneralManagerDTO, HospitalDTO } from '../../models/auth.model';
import { AuthService } from '../../auth/auth.service';

@Injectable({
    providedIn: 'root'
})

export class HospitalManagerService {
    private apiUrl = 'http://localhost:8081/api/v1';
    private storageKey: string = 'HospitalDetails';

    constructor(private http: HttpClient, private auth: AuthService) { }
    get(): Observable<ApiResponse<GeneralManagerDTO[]>> {
        return this.http.get<ApiResponse<GeneralManagerDTO[]>>(`${this.apiUrl}/user/filter`).pipe(
            tap(response => this.handleApiResponse(response)),
            catchError(this.handleError)
        );
    }

    getHospitalManagers(): GeneralManagerDTO[] | null {
        if (this.isBrowser()) {
            const storedData = sessionStorage.getItem(`HospitalManagers`);
            if (storedData) {
                return this.parseData(storedData);
            } else {
                console.log(`No data found in sessionStorage`);
            }
        }
        return null;
    }

    getGeneralManagers(): GeneralManagerDTO[] {
        if (this.isBrowser()) {
            const storedData = sessionStorage.getItem(`GeneralManagers`);
            if (storedData) {
                try {
                    return this.parseData(storedData) as GeneralManagerDTO[];
                } catch (error) {
                    console.error(`Error parsing GeneralManagers data:`, error);
                    return [];
                }
            } else {
                console.log(`No data found in sessionStorage`);
            }
        }
        return [];
    }
    AssignGeneralManager(generalManagerId: string): Observable<ApiResponse<HospitalDTO>> {
        const HospitalId = this.auth.getCurrentUser()?.hospitalId || '';
        return this.http.get<ApiResponse<HospitalDTO>>(
            `${this.apiUrl}/hospital/${HospitalId}`
        ).pipe(
            switchMap(response => {
                if (response.data) {
                    const updatedHospital = {
                        ...response.data,
                        generalManagerId
                    };
                    return this.http.put<ApiResponse<HospitalDTO>>(
                        `${this.apiUrl}/hospital/admin/${HospitalId}`,
                        updatedHospital
                    );
                } else {
                    throw new Error('Hospital data not found');
                }
            }),
            catchError(this.handleError)
        );
    }
    create(item: GeneralManagerDTO, role: string): Observable<ApiResponse<GeneralManagerDTO>> {
        const params = new HttpParams().set('role', role);

        return this.http.post<ApiResponse<GeneralManagerDTO>>(`${this.apiUrl}/auth/register`, item, { params }).pipe(
            catchError(this.handleError)
        );
    }

    update(item: GeneralManagerDTO): Observable<ApiResponse<GeneralManagerDTO>> {
        return this.http.put<ApiResponse<GeneralManagerDTO>>(`${this.apiUrl}/general-manager/${item.id}`, item).pipe(
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


    handleApiResponse(response: ApiResponse<GeneralManagerDTO[]>): void {
        if (response && response.data) {
            const filteredDataByRole = this.filteredDataByRole(response.data);
            const filteredDataByHospital = this.filteredDataByHospital(response.data);
            sessionStorage.setItem(`GeneralManagers`, JSON.stringify(filteredDataByRole));
            sessionStorage.setItem(`HospitalManagers`, JSON.stringify(filteredDataByHospital));
        } else {
            console.warn('Response data is missing or undefined');
        }
    }

    filteredDataByRole(data: GeneralManagerDTO[]): GeneralManagerDTO[] {
        return data.filter(item => {
            return item.role && item.role.name === 'ROLE_GENERAL_MANAGER';
        });
    }
    filteredDataByHospital(data: GeneralManagerDTO[]): GeneralManagerDTO[] {
        const HospitalId = this.auth.getCurrentUser()?.hospitalId || '';
        return data.filter(item => {
            return item.hospitalIds && item.hospitalIds.includes(HospitalId);
        });
    }
    private parseData(storedData: string): GeneralManagerDTO[] | null {
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
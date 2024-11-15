import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  private hideTimeout: any;
  showLoading() {
    this.loadingSubject.next(true);
  }

  hideLoading() {
    this.loadingSubject.next(false);
  }
  // hideLoading() {
  //   if (this.hideTimeout) {
  //     clearTimeout(this.hideTimeout);
  //   }
  //   this.hideTimeout = setTimeout(() => {
  //     this.loadingSubject.next(false);
  //   }, 5000); // Minimum time the spinner will be shown (300ms)
  // }
}

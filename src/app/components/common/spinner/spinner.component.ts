import { Component } from '@angular/core';
import { LoadingService } from '../../../service/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class SpinnerComponent {
  isLoading = this.loadingService.loading$;

  constructor(private loadingService: LoadingService) {}
}

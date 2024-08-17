import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorSnackbarConfig } from '../../../../helpers';
import { Expert } from '../../interfaces/expert.interface';
import { SubscriptionCollection } from '../../interfaces/subscription-collection.interface';
import { ExpertService } from '../../services/expert.service';

@Component({
  selector: 'app-experts',
  standalone: true,
  imports: [MatTableModule, MatProgressSpinnerModule],
  templateUrl: './experts.component.html',
  styleUrl: './experts.component.css',
})
export class ExpertsComponent implements OnInit {
  constructor(
    private expertService: ExpertService,
    private snackBar: MatSnackBar,
  ) {}

  experts: Expert[] = [];
  isLoadingResults = true;
  displayedColumns: string[] = ['id', 'fullname'];
  subs: SubscriptionCollection = {};

  ngOnInit(): void {
    this.expertService.getAllExperts().subscribe({
      next: (experts) => {
        this.experts = experts;
        this.isLoadingResults = false;
      },
      error: (error) => {
        this.snackBar.open(error, undefined, errorSnackbarConfig);
        this.isLoadingResults = false;
      },
    });
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Expert } from '../../interfaces/expert.interface';
import { ExpertService } from '../../services/expert.service';
import { QueryDocumentSnapshot, Unsubscribe } from '@angular/fire/firestore';

@Component({
  selector: 'app-experts',
  standalone: true,
  imports: [MatTableModule, MatProgressSpinnerModule],
  templateUrl: './experts.component.html',
  styleUrl: './experts.component.css',
})
export class ExpertsComponent implements OnInit, OnDestroy {
  constructor(private expertService: ExpertService) {}

  experts: Expert[] = [];
  isLoadingResults = true;
  displayedColumns: string[] = ['name', 'email'];
  unsub: Unsubscribe = () => {};

  ngOnInit(): void {
    this.unsub = this.expertService.getExpertsRealtime((docs: QueryDocumentSnapshot[]) => {
      this.experts = docs.map((doc) => doc.data() as Expert);
      this.isLoadingResults = false;
    });
  }

  ngOnDestroy(): void {
    this.unsub();
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Expert } from '../../../interfaces/expert.interface';
import { Offer } from '../../../interfaces/offer.interface';
import { ExpertService } from '../../../services/expert.service';

@Component({
  selector: 'app-create-offer',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatAutocompleteModule],
  templateUrl: './create-offer.component.html',
  styleUrl: './create-offer.component.css',
})
export class CreateOfferComponent implements OnInit {
  constructor(private expertService: ExpertService) {}

  @Input() offer!: Offer;
  @Output() valid = new EventEmitter<boolean>();

  experts: Expert[] = [];
  filteredExperts: Expert[] = [];

  ngOnInit(): void {
    this.expertService.getAllExperts().subscribe((experts) => {
      this.experts = experts;
      this.filteredExperts = experts.slice();
    });
  }

  handleChange(): void {
    this.valid.emit(this.offer.subject.length > 0 && this.offer.expert.length > 0);
  }

  filterExperts(): void {
    const filterValue = this.offer.expert ? this.offer.expert.toLowerCase() : '';
    this.filteredExperts = this.experts.filter((expert) => expert.fullname.toLowerCase().includes(filterValue));
  }
}

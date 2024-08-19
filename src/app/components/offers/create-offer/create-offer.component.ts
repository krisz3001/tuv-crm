import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Expert } from '../../../interfaces/expert.interface';
import { ExpertService } from '../../../services/expert.service';
import { Offer } from '../../../interfaces/offer.interface';
import { Subscription } from 'rxjs';
import { QueryDocumentSnapshot, Unsubscribe } from '@angular/fire/firestore';

@Component({
  selector: 'app-create-offer',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatAutocompleteModule],
  templateUrl: './create-offer.component.html',
  styleUrl: './create-offer.component.css',
})
export class CreateOfferComponent implements OnInit, OnChanges, OnDestroy {
  constructor(private expertService: ExpertService) {}

  @Input() offer!: Offer;
  @Output() valid = new EventEmitter<boolean>();

  experts: Expert[] = [];
  filteredExperts: Expert[] = [];
  expertsUnsub: Unsubscribe = () => {};

  form = new FormGroup({
    subject: new FormControl('', Validators.required),
    commonAdvisor: new FormControl(''),
    expert: new FormControl('', Validators.required),
  });
  formSub: Subscription = new Subscription();

  ngOnInit(): void {
    this.expertsUnsub = this.expertService.getExpertsRealtime((docs: QueryDocumentSnapshot[]) => {
      this.experts = docs.map((doc) => doc.data() as Expert);
      this.filteredExperts = this.experts;
    });
    this.formSub = this.form.valueChanges.subscribe((values: any) => {
      for (const key in values) {
        if (values[key] !== null) {
          (this.offer as any)[key] = values[key];
        }
      }
      this.valid.emit(this.offer.subject.length > 0 && this.offer.expert.length > 0);
    });
  }

  ngOnChanges(): void {
    this.form.reset();
  }

  filterExperts(): void {
    const filterValue = this.offer.expert ? this.offer.expert.toLowerCase() : '';
    this.filteredExperts = this.experts.filter((expert) => expert.name.toLowerCase().includes(filterValue));
  }

  get subject() {
    return this.form.get('subject')!;
  }

  get commonAdvisor() {
    return this.form.get('commonAdvisor')!;
  }

  get expert() {
    return this.form.get('expert')!;
  }

  ngOnDestroy(): void {
    this.formSub.unsubscribe();
    this.expertsUnsub();
  }
}

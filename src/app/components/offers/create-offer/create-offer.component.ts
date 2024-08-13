import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MESSAGES } from '../../../../messages/messages';
import { Offer } from '../../../../interfaces/offer.interface';
import { SubscriptionCollection } from '../../../../interfaces/subscription-collection.interface';
import { OfferService } from '../../../../services/offer.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ExpertService } from '../../../../services/expert.service';
import { Expert } from '../../../../interfaces/expert.interface';

@Component({
  selector: 'app-create-offer',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatAutocompleteModule],
  templateUrl: './create-offer.component.html',
  styleUrl: './create-offer.component.css',
})
export class CreateOfferComponent implements OnInit, OnDestroy {
  constructor(
    private offerService: OfferService,
    private expertService: ExpertService,
  ) {}

  @Output() offer = new EventEmitter<Offer>();
  @Output() valid = new EventEmitter<boolean>();

  messages = MESSAGES;
  readonly offerForm = new FormGroup({
    subject: new FormControl('', [Validators.required]),
    commonAdvisor: new FormControl(''),
    expert: new FormControl('', [Validators.required]),
  });
  subs: SubscriptionCollection = {};
  experts: Expert[] = [];
  filteredExperts: Expert[] = [];

  ngOnInit(): void {
    this.subs['resetForm'] = this.offerService.resetFormHotline.subscribe(() => {
      this.offerForm.reset();
      this.handleChange();
    });

    this.expertService.getAllExperts().subscribe((experts) => {
      this.experts = experts;
      this.filteredExperts = experts.slice();
    });
  }

  handleChange(): void {
    this.valid.emit(this.offerForm.valid);
    if (this.offerForm.valid) {
      this.offer.emit(this.offerForm.value as Offer);
    }
  }

  filterExperts(): void {
    this.handleChange();
    const filterValue = this.expert.value ? this.expert.value.toLowerCase() : '';
    this.filteredExperts = this.experts.filter((expert) => expert.fullname.toLowerCase().includes(filterValue));
  }

  get subject() {
    return this.offerForm.get('subject')!;
  }

  get commonAdvisor() {
    return this.offerForm.get('commonAdvisor')!;
  }

  get expert() {
    return this.offerForm.get('expert')!;
  }

  get price() {
    return this.offerForm.get('price')!;
  }

  ngOnDestroy(): void {
    Object.values(this.subs).forEach((sub) => sub.unsubscribe());
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateIconComponent } from './state-icon.component';

describe('StateIconComponent', () => {
  let component: StateIconComponent;
  let fixture: ComponentFixture<StateIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StateIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SummaryFormControls } from '../models/summary-form.interface';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-summary-form',
  styleUrl: './summary-form.component.css',
  templateUrl: './summary-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryFormComponent {
  form = input.required<FormGroup<SummaryFormControls>>();
}

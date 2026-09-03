import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SummaryFormControls } from '../models/summary-form.interface';

const DEFAULT_TAX_PERCENT: number = 10;

export function createSummaryForm(): FormGroup<SummaryFormControls> {
  return new FormGroup<SummaryFormControls>({
    percent: new FormControl(DEFAULT_TAX_PERCENT, {
      nonNullable: true,
      validators: [Validators.max(100)]
    })
  });
}

import { FormControl } from '@angular/forms';

export interface SummaryFormData {
  percent: number;
}

// Tipo para os controles do form (derived)
export type SummaryFormControls = {
  [K in keyof SummaryFormData]: FormControl<SummaryFormData[K]>;
};

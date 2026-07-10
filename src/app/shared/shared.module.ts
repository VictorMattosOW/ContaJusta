import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { ButtonLinkComponent } from './components/button-link/button-link.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { AutofocusDirective } from './diretivas/autofocus.directive';
import { CurrencyPipe } from './pipes/currency.pipe';

@NgModule({
  declarations: [
    ButtonComponent,
    ButtonLinkComponent,
    TooltipComponent,
    AutofocusDirective,
    CurrencyPipe,
  ],
  exports: [
    ButtonComponent,
    ButtonLinkComponent,
    TooltipComponent,
    AutofocusDirective,
    CurrencyPipe,
  ],
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}

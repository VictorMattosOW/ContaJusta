import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { ButtonLinkComponent } from './components/button-link/button-link.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { CurrencyPipe } from './pipes/currency.pipe';
import { UserNamesPipe } from './pipes/user-names.pipe';
import { UserNamesDisplayPipe } from './pipes/user-names-display.pipe';

@NgModule({
  declarations: [
    ButtonComponent,
    ButtonLinkComponent,
    TooltipComponent,
    AutofocusDirective,
    CurrencyPipe,
    UserNamesPipe,
    UserNamesDisplayPipe
  ],
  exports: [
    ButtonComponent,
    ButtonLinkComponent,
    TooltipComponent,
    AutofocusDirective,
    CurrencyPipe,
    UserNamesPipe,
    UserNamesDisplayPipe
  ],
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}

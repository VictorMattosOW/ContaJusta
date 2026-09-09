import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../order/services/order.service';
import { ButtonComponent } from 'app/shared/components/button/button.component';

@Component({
  selector: 'app-event-name',
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './event-name.component.html',
  styleUrl: './event-name.component.css'
})
export class EventNameComponent {
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);

  // Um único campo: o nome do rolê que finaliza a conta
  readonly form = new FormGroup({
    eventName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)]
    })
  });

  // Observável do control → signal; initialValue evita undefined no 1º render
  private readonly eventName = toSignal(this.form.controls.eventName.valueChanges, {
    initialValue: ''
  });

  // Botão libera só com texto útil (espaços em branco não contam)
  readonly canSubmit = computed(() => this.eventName().trim().length > 0);

  submit(): void {
    if (!this.canSubmit()) return;

    // Persiste o nome no FinalOrder (mesmo objeto que a divisão já consome)
    // e volta para a tela inicial — encerrando o fluxo.
    this.orderService.setEventName(this.eventName().trim());
    this.router.navigate(['/orders']);
  }
}

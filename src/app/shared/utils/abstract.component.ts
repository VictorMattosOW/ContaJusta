import { Component } from '@angular/core';
import { User } from '../models/user.model';

@Component({ template: '' })
export abstract class AbstractComponent {

  // TODO: vai vazar daqui
  tooltipDisplayStates: boolean[] = [];

  constructor() {}

  multiplyValues(quantity: number, price: number): number {
    return quantity * price;
  }

  // TODO: vai vazar daqui
  onHover(index: number) {
    this.tooltipDisplayStates[index] = true; // Define o estado de exibição do tooltip para o item de índice 'index' como true
  }

  // TODO: vai vazar daqui
  onMouseout(index: number) {
    this.tooltipDisplayStates[index] = false; // Define o estado de exibição do tooltip para o item de índice 'index' como false
  }
}

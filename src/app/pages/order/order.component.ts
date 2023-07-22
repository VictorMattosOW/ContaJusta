import { User } from './../../shared/models/user.model';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Order } from 'src/app/shared/models/order.model';
import { SessionService } from 'src/app/shared/services/session.service';
import { AbstractComponent } from 'src/app/shared/utils/abstract.component';
import * as uuid from 'uuid';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent
  extends AbstractComponent
  implements OnInit, AfterViewInit
{
  @Input() isEdit: boolean = false;
  @Output() buttonAction: EventEmitter<void> = new EventEmitter();
  @Input() set orderEdit(order: Order) {
    this.selectedUsers = [];
    this.sharedFood = [];
    this.setOrderForEdit(order);
  }

  usersList: User[] = [];
  quantity = 1;
  value = '';

  orders: Order[] = [];
  sharedFood: User[] = [];

  orderForm: FormGroup;
  selectedUsers: boolean[] = [];
  markAllUsers = false;
  maxLengthCaracteres = 30;

  tooltipStates: boolean[] = [];
  constructor(private sessionService: SessionService, private router: Router) {
    super();
    this.buildForm();
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.buildForm();
    this.getUsers();
    this.getOrders();
  }

  setOrderForEdit({ name, price, sharedUsers = [], quantity }: Order) {
    this.orderForm.patchValue({
      foodName: name,
      price: price,
    });
    this.quantity = quantity;

    sharedUsers.forEach((user: User, index: number) => {
      const foundIndex = this.usersList.findIndex(
        (userList: User) => userList.id === user.id
      );
      if (foundIndex !== -1) {
        this.selectedUser(foundIndex, true);
      } else {
        this.selectedUser(index, false);
      }
    });
  }

  buildForm() {
    this.orderForm = new FormGroup({
      foodName: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.maxLengthCaracteres),
      ]),
      price: new FormControl(null, [Validators.required, Validators.min(0.01)]),
    });
  }

  editarPessoas() {
    this.sessionService.setOrders(this.orders);
    this.sessionService.setPath('/ordens');
    this.router.navigate(['registrar']);
  }

  getUsers() {
    this.sessionService.getUsersObservable().subscribe({
      next: (users) => {
        if (users.length === 0) {
          this.router.navigate(['registrar']);
        }
        this.usersList = users;
      },
    });
  }

  getOrders() {
    this.sessionService.getOrdersObservable().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
    });
  }

  updateQuantity(event: Event, operation: 'add' | 'subtract') {
    event.preventDefault();

    if (operation === 'add') {
      this.quantity++;
    } else if (operation === 'subtract' && this.quantity > 1) {
      this.quantity--;
    }
  }

  selectAllUser(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.sharedFood = [...this.usersList];
      this.selectedUsers.length = this.sharedFood.length;
      this.selectedUsers.fill(checked);
    } else {
      this.sharedFood = [];
      this.selectedUsers.fill(checked);
    }
    this.markAllUsers = checked;
  }

  selectedUser(index: number, event?: Event | boolean) {
    const checked =
      event instanceof Event
        ? (event.target as HTMLInputElement).checked
        : event;

    if (checked) {
      this.sharedFood.push(this.usersList[index]);
    } else {
      this.sharedFood = this.sharedFood.filter(
        (element) => element !== this.usersList[index]
      );
    }
    this.selectedUsers[index] = checked;
  }

  createOrder() {
    if (this.canEnableSubmitItemButton()) {
      const order: Order = {
        id: uuid.v4(),
        name: this.orderForm.get('foodName').value,
        price: Number(this.orderForm.get('price').value),
        quantity: Number(this.quantity),
        sharedUsers: this.sharedFood,
      };
      this.orders.push(order);
      this.resetForm();
    }
  }

  resetForm() {
    this.quantity = 1;
    this.sharedFood = [];
    this.selectedUsers = [];
    this.markAllUsers = false;
    this.orderForm.reset();
  }

  deleteItem(orderToDelete: Order) {
    this.orders = this.orders.filter((order) => order.id !== orderToDelete.id);
  }

  isValidForm(): boolean {
    this.orderForm.markAllAsTouched();
    return this.orderForm.valid;
  }

  canEnableSubmitItemButton(): boolean {
    return this.isValidForm() && this.sharedFood.length !== 0;
  }

  canEnableButtonGoToSummary(): boolean {
    return this.orders.length > 0;
  }

  goToSummary() {
    if (this.canEnableButtonGoToSummary()) {
      this.createOrder();
      this.sessionService.setOrders(this.orders);
      this.sessionService.setUsers(this.usersList);
      this.router.navigate(['resumo']);
    }
  }

  onHover(index: number) {
    this.tooltipStates[index] = true; // Define o estado de exibição do tooltip para o item de índice 'index' como true
  }

  onMouseout(index: number) {
    this.tooltipStates[index] = false; // Define o estado de exibição do tooltip para o item de índice 'index' como false
  }
}

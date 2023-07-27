import { User } from './../../shared/models/user.model';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/shared/models/order.model';
import { SessionService } from 'src/app/shared/services/session.service';
import { UserServiceService } from 'src/app/shared/services/user-service.service';
import { AbstractComponent } from 'src/app/shared/utils/abstract.component';
import * as uuid from 'uuid';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent extends AbstractComponent implements OnInit, AfterViewInit {
  @ViewChild('dialog') dialogElement!: ElementRef<HTMLDialogElement>;
  orderToEditId: string;

  usersList: User[] = [];
  quantity = 1;
  value = '';

  orders: Order[] = [];
  sharedFood: User[] = [];

  orderForm: FormGroup;
  selectedUsers: boolean[] = [];
  markAllUsers = false;
  maxLengthCaracteres = 30;
  maxNumberOfUsersInDisplay: number;

  isEdit = false;
  orderToEditOrDelete: Order;
  constructor(
    private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private userServices: UserServiceService
  ) {
    super();
    this.buildForm();
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.buildForm();
    this.getUsers();
    this.getOrders();
    this.getPath();
    this.maxNumberOfUsersInDisplay =
      this.userServices.maxNumberOfUsersInDisplayValue;
  }

  openDialog(order: Order): void {
    this.orderToEditOrDelete = order;
    this.dialogElement.nativeElement.show();
  }

  closeDialog(): void {
    this.dialogElement.nativeElement.close();
  }

  getPath() {
    const orderId = this.route.snapshot.params['id'];
    if (orderId !== undefined) {
      this.isEdit = true;
      this.orderToEditOrDelete = this.findOrderById(orderId);
    }

    if (this.orderToEditOrDelete) {
      this.setOrderForEdit(this.orderToEditOrDelete);
    }
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

  getFormattedUserNamesForDisplay(users: User[]): string {
    return this.userServices.getConcatenatedUserNames(users);
  }

  getMaxNumberOfUsersInDisplay(users: User[]): User[] {
    return this.userServices.getMaxNumberOfUsersInDisplay(users);
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
      next: (orders: Order[]) => {
        orders.forEach(order => {
          order.sharedUsers = order.sharedUsers
            .map(user => this.findUserById(user.id))
            .filter(user => user !== undefined);
        });
        this.orders = orders;
      },
    });
  }

  private findUserById(userId: string): User | undefined {
    return this.usersList.find(userList => userList.id === userId);
  }

  private findOrderById(orderId: string): Order | undefined {
    return this.orders.find(order => order.id === orderId);
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

  editOrder() {
    if (this.orderToEditOrDelete) {
      this.orders.forEach((order, index) => {
        if (order.id === this.orderToEditOrDelete.id) {
          this.orders[index] = {
            id: this.orderToEditOrDelete.id,
            name: this.orderForm.get('foodName').value,
            price: Number(this.orderForm.get('price').value),
            quantity: Number(this.quantity),
            sharedUsers: this.sharedFood,
          }
        }
      });
      this.saveOrders();
      this.navigateTo();
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
    // this.saveOrders();
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

  saveOrders() {
    this.sessionService.setOrders(this.orders);
    this.sessionService.setUsers(this.usersList);
  }

  navigateTo() {
    this.router.navigate(['resumo']);
  }

  goToSummary() {
    if (this.canEnableButtonGoToSummary()) {
      this.saveOrders();
      this.navigateTo();
    }
  }
}

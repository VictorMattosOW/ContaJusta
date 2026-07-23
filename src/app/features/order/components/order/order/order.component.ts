import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderFormComponent } from '../order-form/order-form.component';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'app/core/models/user.model';
import { Order } from 'app/core/models/order.model';
import { OrderFormData } from 'app/features/order/models/order-form.interface';
import { SessionService } from 'app/shared/services/session.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent implements OnInit, OnDestroy {
  @ViewChild('dialog') dialogElement!: ElementRef<HTMLDialogElement>;
  @ViewChild(OrderFormComponent) orderForm: OrderFormComponent = {} as OrderFormComponent;
  private readonly destroy$ = new Subject<void>();
  orderToEditId = '';

  usersList: User[] = [];
  quantity = 1;
  value = '';

  orders: Order[] = [];
  order: OrderFormData = {} as OrderFormData;
  sharedFood: User[] = [];

  resetCheckbox = false;
  isEdit = false;
  orderToEditOrDelete: Order | undefined = {} as Order;
  isSubmitButton = false;
  hasUserSelected = false;

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // TODO: Onde tem subscribe eu preciso criar um destroy para resolver problema de memory leak.
  ngOnInit(): void {
    this.getUsers();
    this.getOrders();
    this.getPath();
  }

  ngOnDestroy(): void {
    this.getUsers();
    this.getOrders();
  }

  getFormData(order: OrderFormData) {
    this.order = order;
  }

  getSharedUserFood(users: User[]) {
    this.hasUserSelected = users.length > 0;
    this.sharedFood = users;
  }

  openDialog(order?: Order): void {
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
    // this.orderForm.patchValue({
    //   foodName: name,
    //   price: price,
    // });
    this.quantity = quantity;

    // sharedUsers.forEach((user: User, index: number) => {
    //   const foundIndex = this.usersList.findIndex((userList: User) => userList.id === user.id);
    //   if (foundIndex !== -1) {
    //     this.selectedUser(foundIndex, true);
    //   } else {
    //     this.selectedUser(index, false);
    //   }
    // });
  }

  editarPessoas() {
    this.sessionService.setOrders(this.orders);
    this.sessionService.setPath('/ordens');
    this.router.navigate(['registrar']);
  }

  getUsers() {
    // this.orderForm.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
    //   this.formValidityChange.emit(this.orderForm.valid);
    // });
    this.sessionService
      .getUsersObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          if (users.length === 0) {
            // this.router.navigate(['registrar']);
          }
          this.usersList = users;
        }
      });
  }

  getOrders() {
    this.sessionService
      .getOrdersObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders: Order[]) => {
          orders.forEach((order) => {
            order.sharedUsers = order.sharedUsers
              .map((user) => this.findUserById(user.id))
              .filter((user): user is User => user !== undefined);
          });
          this.orders = orders;
        }
      });
  }

  private findUserById(userId: string): User | undefined {
    return this.usersList.find((userList) => userList.id === userId);
  }

  private findOrderById(orderId: string): Order | undefined {
    return this.orders.find((order) => order.id === orderId);
  }

  createOrder() {
    this.orderForm.submitOrder();
    const order: Order = {
      id: `${this.order.foodName} + ${Date.now()}`,
      name: this.order.foodName,
      price: this.order.price,
      quantity: this.order.quantity,
      sharedUsers: this.sharedFood
    };
    this.orders = [...this.orders, order];

    this.resetCheckbox = true;
    setTimeout(() => (this.resetCheckbox = false));
  }

  // TODO: tirar esses "!"
  editOrder() {
    if (this.orderToEditOrDelete) {
      // const formValues = this.orderForm.value;
      // this.orders.forEach((order, index) => {
      //   if (order.id === this.orderToEditOrDelete!.id) {
      //     this.orders[index] = {
      //       id: this.orderToEditOrDelete!.id,
      //       name: formValues.foodName,
      //       price: Number(formValues.price),
      //       quantity: Number(this.quantity),
      //       sharedUsers: this.sharedFood,
      //     };
      //   }
      // });
      this.saveOrders();
      this.navigateTo();
    }
  }

  resetForm() {
    this.quantity = 1;
    this.sharedFood = [];
  }

  deleteItem(orderToDelete: Order) {
    this.orders = this.orders.filter((order) => order.id !== orderToDelete.id);
    // this.saveOrders();
  }

  // isValidForm(): boolean {
  //   this.orderForm.markAllAsTouched();
  //   return this.orderForm.valid;
  // }

  canEnableSubmitItemButton(): boolean {
    // return this.isValidForm() && this.sharedFood.length !== 0;
    return true;
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

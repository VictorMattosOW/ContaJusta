import { SessionService } from './../services/session.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Order } from 'src/app/shared/models/order.model';
import { User } from 'src/app/shared/models/user.model';
import * as uuid from 'uuid';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  usersList: User[] = [];
  quantity = 1;
  value = '';

  orders: Order[] = [];
  sharedFood: User[] = [];

  orderForm: FormGroup;
  sharedUsers: FormGroup;
  selectedUsers: boolean[] = [];
  constructor(
    private sessionService: SessionService,
    private router: Router,
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.buildForm();
    this.getUsers();
    this.getOrders();
  }

  buildForm() {
    this.orderForm = new FormGroup({
      foodName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25),
      ]),
      price: new FormControl(0, [Validators.required]),
    });
  }

  editarPessoas() {
    this.sessionService.setOrders(this.orders);
    this.router.navigate(['registration']);
  }

  getUsers() {
    this.sessionService.getUsersObservable().subscribe({
      next: (users) => {
        if (users.length === 0) {
          this.router.navigate(['registration']);
        }
        this.usersList = users;
      },
    });
  }

  getOrders() {
    this.sessionService.getOrdersObservable().subscribe({
      next: (orders) => {
        this.orders = orders;
      }
    })
  }

  updateQuantity(event: Event, operation: 'add' | 'subtract') {
    event.preventDefault();

    if (operation === 'add') {
      this.quantity++;
    } else if (operation === 'subtract' && this.quantity > 1) {
      this.quantity--;
    }
  }

  selectedUser(checked: boolean, index: number) {
    if (checked) {
      this.sharedFood.push(this.usersList[index]);
      this.selectedUsers[index] = checked;
    } else if (!checked) {
      this.selectedUsers[index] = checked;
      this.sharedFood = this.sharedFood.filter(
        (element) => element !== this.usersList[index],
      );
    }
  }

  selectOrder() {
    const order: Order = {
      id: uuid.v4(),
      name: this.orderForm.get('foodName').value,
      price: this.orderForm.get('price').value,
      quantity: this.quantity,
      sharedUsers: this.sharedFood,
    };
    this.orders.push(order);
    this.orderForm.reset();
    this.quantity = 1;
    this.sharedFood = [];
    this.selectedUsers = [];
  }

  deleteItem(orderToDelete: Order) {
    this.orders = this.orders.filter((order) => order.id !== orderToDelete.id);
  }

  getSharedUserNames(order: Order): string {
    return order.sharedUsers.map((user) => user.name).join(', ');
  }
}

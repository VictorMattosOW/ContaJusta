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
  usersList: string[] = [];
  quantity = 1;
  value = '';

  orders: User[];
  ordersList: string[] = [];

  orderForm: FormGroup;
  constructor(private sessionService: SessionService, private router: Router) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.buildForm();
    this.getUsers();
  }

  buildForm() {
    this.orderForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25),
      ]),
      price: new FormControl(0, [Validators.required]),
    });
  }

  editarPessoas() {
    this.router.navigate(['registration']);
  }

  getUsers() {
    this.sessionService.getUsersObservable().subscribe({
      next: (users) => {
        if (users.length === 0) {
          this.router.navigate(['registration']);
        }
        this.usersList = users.map((user) => {
          return user.name;
        });
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

  selectedUser(event, i) {
    if (event.target.checked) {
      this.ordersList.push(this.usersList[i]);
    } else if (!event.target.checked) {
      this.ordersList = this.ordersList.filter(
        (element) => element !== this.usersList[i]
      );
    }
  }

  selectOrder() {
    const order: Order = {
      id: uuid.v4(),
      name: this.orderForm.get('name').value,
      price: Number(this.orderForm.get('price').value),
      quantity: this.quantity,
      sharedUsers: []
    };

    // const user: User = {
    // };
    console.log(order);
    // this.orders.push()
  }
}

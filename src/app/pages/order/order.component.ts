import { SessionService } from './../services/session.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Food {
  price: number;
  name: string;
  amount: number;
  sharedFood: string[];
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  usersList = [];
  orderFood = {} as Food;
  quantity = 1;
  value = '';

  orders = [
    {
      name: 'Polenta frita',
      persons: ['Mariana', 'Victor', 'Paula'],
    },
    {
      name: 'Batata frita',
      persons: ['Paula'],
    },
  ];

  orderForm: FormGroup;
  // TODO: retirar o mask e colocar outra biblioteca
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
      price: new FormControl('', [Validators.required]),
    });
  }

  editarPessoas() {
    this.router.navigate(['userRegistration']);
  }

  getUsers() {
    this.sessionService.getUsersObservable().subscribe({
      next: (users) => {
        if (users.length === 0) {
          // this.router.navigate(['userRegistration']);
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
      this.orderFood.sharedFood.push(this.usersList[i]);
    } else if (!event.target.checked) {
      this.orderFood.sharedFood.splice(0, this.usersList[i]);
    }
    // this.orderFood = {
    //   amount: 1,
    //   name: 'comida',
    //   price: 12.70,
    //   sharedFood: ['teste']
    // }
    // this.orderFood.sharedFood.push('teste2')
    console.log(this.orderFood);
  }

  teste() {
    console.log(this.orderForm.value);
  }
}

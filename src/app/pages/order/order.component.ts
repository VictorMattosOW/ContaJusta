import { SessionService } from './../services/session.service';
import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  usersList = [];
  orderFood = {} as Food;
  quantity = 1;
  value = '';
// TODO: retirar o mask e colocar outra biblioteca
  constructor(
    private sessionService: SessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  editarPessoas() {
    this.router.navigate(['userRegistration']);
  }

  getUsers() {
    this.sessionService.getUsersObservable().subscribe({
      next: (users) => {
        if (users.length === 0) {
          this.router.navigate(['userRegistration']);
        }
        this.usersList = users.map(user => {
          return user.name;
        });
      }
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
    console.log( this.orderFood);
  }

  teste() {
    console.log('consegui');

  }
}

import { User } from "./user.model";

export interface Order {
  id: string;
  name: string;
  quantity: number;
  price: number;
  sharedUsers: User[];
}

export interface FinalOrder {
  tax: number;
  orders: Order[];
}

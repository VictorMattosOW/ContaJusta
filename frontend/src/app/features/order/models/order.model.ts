import { User } from '../../user-registration/models/user.model';

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
  users: User[];
  groupName?: string;
}

export interface SharedFood {
  orderId: string;
  food: string;
  sharedValue: number;
}

export interface OrderPerUser {
  userId: string;
  name: string;
  orders: SharedFood[];
  // users: User[];
  totalValue: number;
}

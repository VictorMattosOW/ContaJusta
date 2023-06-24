import { User } from "./user.model";

export interface Order {
  id: string;
  name: string;
  quantity: number;
  price: string;
  sharedUsers: User[];
}
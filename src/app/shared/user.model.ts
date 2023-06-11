interface User {
  name: string;
  orders?: Order[];
  total?: number;
}

interface Order {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

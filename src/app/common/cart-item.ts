import { Product } from './product';

// try with extends next time?
export class CartItem {
  id: number;
  sku: string;
  name: string;
  description: string;
  unitPrice: number;
  imageUrl: string;
  active: boolean;
  unitsInStock: number;
  dateCreated: Date;
  lastUpdated: Date;
  // new field for this class
  quantity: number;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.unitPrice = product.unitPrice;
    this.description = product.description;
    this.imageUrl = product.imageUrl;
    this.quantity = 1;
  }
}

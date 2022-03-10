import { Injectable } from '@angular/core';
import { ObjectUnsubscribedError, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  //empty array
  cartItmes: CartItem[] = [];
  // Subject is subclass of Observable, use to publish events to all of subscriber
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {}

  addToCart(cartItem: CartItem) {
    //Check if we already have item in cart?
    let isInCart: boolean;
    let inCartItem: CartItem = undefined;
    if (this.cartItmes.length > 0) {
      //  find item in the cart based on Id
      //  cartItems array store only differenttype of items, not the Object itself
      //  New code using find()
      inCartItem = this.cartItmes.find(
        (tempCartItem) => tempCartItem.id === cartItem.id
      );
      //old code to check Id
      /*
      for (let tempCartItem of this.cartItmes) {
        //  check if found
        if (tempCartItem.id === cartItem.id) {
          inCartItem = tempCartItem;
          break;
        }
      }
      */
      isInCart = inCartItem != undefined;
    }
    if (isInCart) {
      // set item already exist in cart quantity ++
      inCartItem.quantity++;
    } else {
      this.cartItmes.push(cartItem);
    }
    this.computeCartTotal();
    // calculate total price and quantity
  }

  decrementItemFromCart(cartItem: CartItem) {
    cartItem.quantity--;
    if (cartItem.quantity === 0) {
      this.removeFromCart(cartItem);
    } else {
      this.computeCartTotal();
    }
  }
  // Code to remove the item from Array , typescript
  removeFromCart(cartItem: CartItem) {
    const indexOfCartItem = this.cartItmes.findIndex(
      (tempCartItem) => tempCartItem.id === cartItem.id
    );
    if (indexOfCartItem > -1) {
      this.cartItmes.splice(indexOfCartItem, 1);
    }
    // end
    this.computeCartTotal();

  }

  computeCartTotal() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let tempCartItem of this.cartItmes) {
      totalPriceValue =
        totalPriceValue + tempCartItem.unitPrice * tempCartItem.quantity;
      totalQuantityValue = totalQuantityValue + tempCartItem.quantity;
    }
    // publish new value to all subscriber
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data for debug
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Items in cart: ');
    for (let cartItem of this.cartItmes) {
      const subTotalPrice = cartItem.quantity * cartItem.unitPrice;
      console.log(
        `name: ` +
          cartItem.name +
          ` unitPrice: ` +
          cartItem.unitPrice +
          ` quantity: ` +
          cartItem.quantity +
          ` subTotal:` +
          subTotalPrice
      );
    }
    // display totalPrice with 2 decimal digit
    console.log(
      `totalPrice: ` +
        totalPriceValue.toFixed(2) +
        `totalQuantity: ` +
        totalQuantityValue
    );
  }

  getTotalPrice(){
    
  }
}

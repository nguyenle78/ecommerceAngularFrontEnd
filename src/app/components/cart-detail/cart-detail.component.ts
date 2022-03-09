import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css'],
})
export class CartDetailComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.listCartDetail();
  }
  listCartDetail() {
    // get handle to the cart items
    this.cartItems = this.cartService.cartItmes;
    //  subscribe to totalPrice
    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));
    // subscribe to totalQuantity
    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );
    // compute cart total Price and total quantity
    this.cartService.computeCartTotal();
  }
  
  incrementCartItem(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }

  decrementCartItem(cartItem: CartItem) {
    this.cartService.decrementItemFromCart(cartItem);
  }

  removeFromCart(cartItem: CartItem){
    this.cartService.removeFromCart(cartItem);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css'],
})
export class WelcomePageComponent implements OnInit {
  products: Product[];
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.listRandomProduct();
  }
  listRandomProduct() {
    this.productService.getRandomProductList().subscribe((data) => {
      this.products = data;
    });
  }
  addToCart(product: Product) {
    const cartItem = new CartItem(product);
    console.log('debug');
    this.cartService.addToCart(cartItem);
  }
}

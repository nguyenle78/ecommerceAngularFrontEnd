import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  //  Race Conditrions:
  //  with product: Prodduct product hasnt been instantiate hence null value
  //  Yet it still work because Angular
  //  automatically update HTML with data binding.
  //  Solution: instanctiate with empty product
  //  product: Product = new Product(), or put ?-mark
  //  everywhere where it might need to call for uninstancetiated
  product: Product = new Product();
  //  inject service and route
  constructor(
    private producService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }
  handleProductDetails(): void {
    //  get "id" Param string, then covert to number with "+"
    const productId: number = +this.route.snapshot.paramMap.get('id');
    this.producService.getProduct(productId).subscribe((data) => {
      this.product = data;
    });
  }
  addToCart(product: Product) {
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
}

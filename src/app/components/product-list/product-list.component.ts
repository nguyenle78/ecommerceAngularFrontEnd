import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  //  templateUrl: './product-list.component.html
  //  templateUrl: './product-list-table.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[];
  currenCategoryId: number;
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  searchByIdMode: boolean = false;
  //  properties for pagination
  pageNumber: number = 1;
  pageSize: number = 8;
  totalElements: number = 0;

  previsouKeyword: string = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Basiclally this tell angular to configure parameterMap onInit to subscribe to listProduct()

    this.route.paramMap.subscribe(() => {
      //  check if "id" and "keyword" parameter is available
      this.listProduct();
    });
  }

  listProduct() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    this.searchByIdMode = this.route.snapshot.paramMap.has('id');
    if (this.searchMode) {
      console.log('running search by name');
      this.handleSearchProductPaginate();
    }
    if (this.searchByIdMode) {
      console.log('Runig search by ID');
      this.handlelistProductByIdPaginate();
    }
    if (!this.searchByIdMode && !this.searchMode) {
      this.productService.getRandomProductList();
    }
  }

  /* Search without pagination
  handleSearchProduct() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');
    this.productService.searchProduct(theKeyword).subscribe((data) => {
      this.products = data;
    });
  }
  */
  handleSearchProductPaginate() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');
    //  if we have different keyword than previous, then set pageNUmber to 1
    if (this.previsouKeyword != theKeyword) {
      this.pageNumber = 1;
    }
    this.previsouKeyword = theKeyword;

    this.productService
      .searchProductPaginate(theKeyword, this.pageNumber - 1, this.pageSize)
      .subscribe(this.processResult());
  }

  handlelistProductByIdPaginate() {
    //get "id" para String, then convert to number with "+" symbol
    this.currenCategoryId = +this.route.snapshot.paramMap.get('id');
    //  Check if we have different categorythan previous
    //  if we have different category than previous
    //  then set pageNumber to 1

    if (this.previousCategoryId != this.currenCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currenCategoryId;
    console.log(
      `Running search by Id` +
        `curentCategoryId= ${this.currenCategoryId}, pageNumber= ${this.pageNumber}`
    );

    // now get products of given categoryId
    this.productService
      .getProductListPaginate(
        //  Angular page is 1-based while Spring is 0-based
        this.pageNumber - 1,
        this.pageSize,
        this.currenCategoryId
      )
      .subscribe(this.processResult());
  }

  processResult() {
    return (data: {
      _embedded: { products: Product[] };
      page: { number: number; size: number; totalElements: number };
    }) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  handlelistAllProduct() {
    this.productService.getAllProduct().subscribe((data) => {
      this.products = data;
    });
  }

  updatePageSize(pageSize: number) {
    console.log('Pagesize:' + pageSize);
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProduct();
  }

  addToCart(product: Product) {
    const cartItem = new CartItem(product);
    console.log('debug');
    this.cartService.addToCart(cartItem);
  }
}

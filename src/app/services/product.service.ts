import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';
  //  Landingpage Url, has randomized products
  private ourproductsUrl = 'http://localhost:8080/api/our-products';

  constructor(
    // inject httpClient to use http methods
    private httpClient: HttpClient
  ) {}
  getAllProduct(): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProduct>(this.baseUrl)
      .pipe(map((response) => response._embedded.products));
  }
  //
  getProductListById(categoryId: number): Observable<Product[]> {
    //  build url based on categoryId
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(searchUrl);
  }

  getProductListPaginate(
    page: number,
    pageSize: number,
    categoryId: number
  ): Observable<GetResponseProduct> {
    //  build url based on searhed keyword
    const searchUrl =
      `${this.baseUrl}/search/findByCategoryId?id=${categoryId}` +
      `&page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  // search for product contain with name
  searchProduct(theKeyword: string): Observable<Product[]> {
    //  need to build Url based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }

  // search product with pagination support
  searchProductPaginate(
    keyword: string,
    page: number,
    pageSize: number
  ): Observable<GetResponseProduct> {
    //  build url based on categoryId
    const searchUrl =
      `${this.baseUrl}/search/findByNameContaining?name=${keyword}` +
      `&page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  // get products by Category
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  //  Refactored code for searchProduct based on argument
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProduct>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }

  //  Get single product
  getProduct(productId: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}/${productId}`);
  }

  // LandingPage
  getRandomProductList(): Observable<Product[]> {
    return this.httpClient
      .get<GetRespondRandomProduct>(this.ourproductsUrl)
      .pipe(map((response) => response.content));
  }
}

//  interface to unwrap the JSON object, in last project I dont have
//  relationship in DB so Response Entity can be
//  sent as JSON when use List in Backend.
//  Morecomplicated if use Page instead of List from Back End
//  For Landing page we just use simple List, send as JSON
interface GetResponseProduct {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface GetResponseProductCategory {
  _embedded: {
    //  be aware that name MUST be the same as JSON object that passed from Back-End, i.e productCategory, not productCategories
    productCategory: ProductCategory[];
  };
}

interface GetRespondRandomProduct {
  content: Product[];
}

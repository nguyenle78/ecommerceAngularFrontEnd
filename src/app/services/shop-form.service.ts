import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopFormService {
  constructor() {}

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    // build array for Month Drop-down list
    // -start = crurent month
    for (let month: number = startMonth; month <= 12; month++) {
      data.push(month);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    // build array for Month Drop-down list
    // get current Year form Date object
    let startYear = new Date().getFullYear();
    for (var year: number = startYear; year <= startYear + 10; year++) {
      data.push(year);
    }
    return of(data);
  }
}

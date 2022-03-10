import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root',
})
export class ShopFormService {
  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(
    // inject httpClient to use http methods
    private httpClient: HttpClient
  ) {}

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

  getCountries(): Observable<Country[]> {
    return this.httpClient
      .get<GetRespondCountries>(this.countriesUrl)
      .pipe(map((response) => response._embedded.countries));
  }

  getStatesByCountry(countryCode: String): Observable<State[]> {
    const searchUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;
    return this.httpClient
      .get<GetRespondStates>(searchUrl)
      .pipe(map((respone) => respone._embedded.states));
  }
}
// unwrap _embedded JSON respond by REST API
interface GetRespondCountries {
  _embedded: {
    countries: Country[];
  };
}

interface GetRespondStates {
  _embedded: {
    states: State[];
  };
}

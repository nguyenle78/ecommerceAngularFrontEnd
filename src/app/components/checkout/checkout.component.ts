import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { ShopFormService } from 'src/app/services/shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;

  startMonth: number = new Date().getMonth();
  creditCardMonths: number[];
  creditCardYears: number[];
  selectedMonth: number;
  selectedYear: number;

  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  countries: Country[] = [];

  billllingAdressSameAsShipping: any;
  deliveryStates: State[] = [];
  billingStates: State[] = [];

  constructor(
    private formBulder: FormBuilder,
    private shopFormService: ShopFormService,
    private cartService: CartService
  ) {
    this.billllingAdressSameAsShipping = true;
  }

  ngOnInit(): void {
    // build Form
    this.checkoutFormGroup = this.formBulder.group({
      customer: this.formBulder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      deliveryAddress: this.formBulder.group({
        address: [''],
        zipCode: [''],
        city: [''],
        country: [''],
        state: [''],
      }),
      billingAddress: this.formBulder.group({
        address: [''],
        zipCode: [''],
        city: [''],
        country: [''],
        state: [''],
      }),
      creditCard: this.formBulder.group({
        cardType: [''],
        cardNumber: [''],
        cardHolder: [''],
        expireMonth: [''],
        expireYear: [''],
        ccv: [''],
      }),
    });

    //  populate creditcard year
    this.shopFormService.getCreditCardYears().subscribe((data) => {
      this.creditCardYears = data;
      console.log('Retrieved creditcard year: ' + JSON.stringify(data));
    });

    //  populate credit card month
    let startMonth = this.startMonth;
    // typescript month start at base 0
    this.shopFormService
      .getCreditCardMonths(startMonth + 1)
      .subscribe((data) => {
        this.creditCardMonths = data;
      });

    //  Populate countries
    this.shopFormService.getCountries().subscribe((data) => {
      this.countries = data;
    });

    //  fill in total price and quantity
    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));
    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );
    // compute the total to get result
    this.cartService.computeCartTotal();
    console.log('Total price' + this.totalPrice);
  }

  handleCheckedCopyShippingToBilling(event: Event) {
    // old angular doesnt work, heres for angular 13
    const isChecked = (<HTMLInputElement>event.target).checked;
    if (!isChecked) {
      this.billllingAdressSameAsShipping = false;
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingStates = [];
    } else {
      this.billllingAdressSameAsShipping = true;
      this.copyShippingToBilling();
    }
  }

  // on event user press Proceed button
  onProceed() {
    console.log('Customer Inf');
    // need to hook this method to component in html file
    console.log(this.checkoutFormGroup.get('customer').value);
    // access nested element
    console.log(this.checkoutFormGroup.get('customer').value.lastName);

    //  copy shipping address to billing adress
    if (this.billllingAdressSameAsShipping) {
      this.copyShippingToBilling();
    }

    console.log(
      'Shipping addres: ' +
        this.checkoutFormGroup.get('deliveryAddress').value.country.name +
        'state: ' +
        this.checkoutFormGroup.get('deliveryAddress').value.state
    );

    console.log(
      'Billing addres: ' +
        this.checkoutFormGroup.get('billingAddress').value.country.name +
        'state: ' +
        this.checkoutFormGroup.get('billingAddress').value.state
    );
  }

  handleYearChange() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();

    const selectedYear = Number(creditCardFormGroup.value.expireYear);
    if (currentYear === selectedYear) {
      let startMonth = new Date().getMonth();
      this.shopFormService
        .getCreditCardMonths(startMonth + 1)
        .subscribe((data) => {
          this.creditCardMonths = data;
        });
    } else {
      this.shopFormService.getCreditCardMonths(1).subscribe((data) => {
        this.creditCardMonths = data;
      });
    }
  }

  copyShippingToBilling() {
    this.checkoutFormGroup.controls['billingAddress'].setValue(
      this.checkoutFormGroup.controls['deliveryAddress'].value
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const country = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;
    console.log('name ' + countryName + ' code: ' + country);

    // get states from service
    this.shopFormService.getStatesByCountry(country).subscribe((data) => {
      // Populate for billing or shipping address
      if (formGroupName === 'deliveryAddress') {
        this.deliveryStates = data;
      } else {
        this.billingStates = data;
      }
      formGroup.get('state').setValue(data[0].name);
    });
  }
}

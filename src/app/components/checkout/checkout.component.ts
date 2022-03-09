import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  constructor(
    private formBulder: FormBuilder,
    private shopFormService: ShopFormService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // build Form
    this.checkoutFormGroup = this.formBulder.group({
      // name of first formGroup  'customer' will be passed to html
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
      }),
      billingAddress: this.formBulder.group({
        address: [''],
        zipCode: [''],
        city: [''],
        country: [''],
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
    this.shopFormService.getCreditCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
      console.log('Retrieved creditcard month: ' + JSON.stringify(data));
    });

    //
  }

  copyShippingToBillingAddress(event: Event) {
    const ischecked = (<HTMLInputElement>event.target).checked;
    if (ischecked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['deliveryAddress'].value
      );
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  onBack() {
    console.log('Back to cart');
  }

  onProceed() {
    console.log('Customer Inf');
    // need to hook this method to component in html file
    console.log(this.checkoutFormGroup.get('customer').value);
    // accessnested element
    console.log(this.checkoutFormGroup.get('customer').value.lastName);
  }

  handleYearChange() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
   console.log("debug");
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup.value.expirationYear
    );

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });
  }
}

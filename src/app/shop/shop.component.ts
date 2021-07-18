import { Component, OnInit } from '@angular/core';
import { CartItem } from '../cart/cart.model';
import {HttpClient} from '../http.service';
import { Response, Request } from '@angular/http';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  hostUrl = "http://localhost/book_store/public";
  discountUrl: string;

  cartTotal: number = 0;
  cartDiscount: number = 0;
  cartItems: CartItem[] = [];
  couponId: string;

  constructor(private Http : HttpClient) {
    this.discountUrl = this.hostUrl +'/discount/amount' ;
  }

  ngOnInit() {
    this.updateCartTotal();
  }

  onCartItemDeleted(productData: { productId: number }) {
    const index = this.cartItems.findIndex(elem => elem.id == productData.productId)
    this.cartItems.splice(index, 1);
    this.updateCartTotal();
  }

  onCartItemChanged(productData: { productId: number }) {
    this.updateCartTotal();
  }

  onCartCouponChanged(productData: { couponId: string }) {
    this.couponId = productData.couponId;
    this.updateCartTotal();
  }

  onCartUpdated(productData: {
    productId: number,
    productName: string,
    productPrice: number
  }) {
    const index = this.cartItems.findIndex(elem => elem.id == productData.productId)
    if (index === -1) {
      this.cartItems.push({
        id: productData.productId,
        name: productData.productName,
        quantity: 1,
        price: productData.productPrice,
        total: productData.productPrice * 1
      });
    } else {
      this.cartItems[index].id = productData.productId;
      this.cartItems[index].name = productData.productName;
      this.cartItems[index].quantity++;
      this.cartItems[index].price = productData.productPrice;
      this.cartItems[index].total = this.cartItems[index].price * this.cartItems[index].quantity;
    }
    this.updateCartTotal();
  }

  updateCartTotal() {
    //the code to update the total property of the cart
    let total = 0;
    this.cartItems.map(elem => total = total + elem.quantity * elem.price);
    this.cartTotal = total;
    
    let items = [];
    this.cartItems.map(item => {
      items.push({
        id : item.id,
        qty : item.quantity 
      });
    });
    let coupon = this.couponId;

    this.Http.post(this.discountUrl, {items : items, coupon : coupon})
      .map((response: Response) => response.json())
      .subscribe((result: any) => {
        this.cartDiscount = result.data.amount;
      });

  }

}

import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '../http.service';
import { ProductItem } from './product.model'
import { Response, Request } from '@angular/http';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  hostUrl = "http://localhost/book_store/public";
  bookListUrl: string;

  @Input() categoryId: number;

  constructor(private Http: HttpClient) {
    this.bookListUrl = this.hostUrl + '/books/list/';
  }

  productItem: ProductItem[] = [];

  @Output() cartUpdated = new EventEmitter<{
    productId: number,
    productName: string,
    productPrice: number
  }>();


  ngOnInit() {
    this.Http.get(this.bookListUrl + this.categoryId, {})
      .map((response: Response) => response.json())
      .subscribe((result: any) => {
        result.data.map(item => {
          this.productItem.push(new ProductItem(item));
        })
      });
  }

  onCartUpdated(event) {
    const id = event.target.getAttribute('id');
    const index = this.productItem.findIndex(elem => elem.id == id);
    this.cartUpdated.emit({
      productId: this.productItem[index].id,
      productName: this.productItem[index].name,
      productPrice: this.productItem[index].price
    });
  }


}

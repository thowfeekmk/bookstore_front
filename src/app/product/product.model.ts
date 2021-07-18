// import { Ingredient } from '../shared/ingredient.model';

export class ProductItem {
  public id: number;
  public name: string;
  public price: number;
  public imageUrl: string;
  public storage: number;
  public author: string;
  public description: string;
//   public ingredients: Ingredient[];

  constructor(item) {
    this.id = item.id;
    this.name = item.title;
    this.price = item.price;
    this.imageUrl = item.image;
    this.author = item.author;
    this.description = item.description;
  }
}

import { IProductCategory } from 'app/shared/model/product-category.model';

export interface IProduct {
  id?: number;
  code?: string;
  name?: string;
  productCategory?: IProductCategory;
}

export class Product implements IProduct {
  constructor(public id?: number, public code?: string, public name?: string, public productCategory?: IProductCategory) {}
}

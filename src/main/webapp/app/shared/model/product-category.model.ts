export interface IProductCategory {
  id?: number;
  code?: string;
  name?: string;
  parent?: IProductCategory;
}

export class ProductCategory implements IProductCategory {
  constructor(public id?: number, public code?: string, public name?: string, public parent?: IProductCategory) {}
}

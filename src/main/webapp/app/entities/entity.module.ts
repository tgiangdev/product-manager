import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'product-category',
        loadChildren: () => import('./product-category/product-category.module').then(m => m.ProductManagerProductCategoryModule),
      },
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then(m => m.ProductManagerProductModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class ProductManagerEntityModule {}

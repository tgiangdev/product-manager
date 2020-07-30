import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IProductCategory, ProductCategory } from 'app/shared/model/product-category.model';
import { ProductCategoryService } from './product-category.service';

@Component({
  selector: 'jhi-product-category-update',
  templateUrl: './product-category-update.component.html',
})
export class ProductCategoryUpdateComponent implements OnInit {
  isSaving = false;
  parents: IProductCategory[] = [];

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.maxLength(20)]],
    name: [null, [Validators.required, Validators.maxLength(100)]],
    parent: [],
  });

  constructor(
    protected productCategoryService: ProductCategoryService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productCategory }) => {
      this.updateForm(productCategory);

      this.productCategoryService
        .query({ filter: 'productcategory-is-null' })
        .pipe(
          map((res: HttpResponse<IProductCategory[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IProductCategory[]) => {
          if (!productCategory.parent || !productCategory.parent.id) {
            this.parents = resBody;
          } else {
            this.productCategoryService
              .find(productCategory.parent.id)
              .pipe(
                map((subRes: HttpResponse<IProductCategory>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IProductCategory[]) => (this.parents = concatRes));
          }
        });
    });
  }

  updateForm(productCategory: IProductCategory): void {
    this.editForm.patchValue({
      id: productCategory.id,
      code: productCategory.code,
      name: productCategory.name,
      parent: productCategory.parent,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productCategory = this.createFromForm();
    if (productCategory.id !== undefined) {
      this.subscribeToSaveResponse(this.productCategoryService.update(productCategory));
    } else {
      this.subscribeToSaveResponse(this.productCategoryService.create(productCategory));
    }
  }

  private createFromForm(): IProductCategory {
    return {
      ...new ProductCategory(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
      parent: this.editForm.get(['parent'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductCategory>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IProductCategory): any {
    return item.id;
  }
}

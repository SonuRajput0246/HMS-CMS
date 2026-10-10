import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../../../services/inventory.service';
import { CustomSnackbarService } from '../../../shared/custom-snackbar/custom-snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { IGenericPagination } from '../../../models/ICommon.model';

@Component({
  selector: 'app-manage-inventory',
  templateUrl: './manage-inventory.component.html',
  styleUrl: './manage-inventory.component.scss'
})
export class ManageInventoryComponent {

  private fb = inject(FormBuilder);
  private _inventoryService = inject(InventoryService)
  private _router = inject(Router);
  private _snackbar = inject(CustomSnackbarService);
  private AR = inject(ActivatedRoute);

  inventoryForm!: FormGroup;
  breakpoint = 3;

  hidePassword = true;
  isLoading = false;
  isPageLoad = false;
  isCategoryLoading = false;
  isUnitsLoading = false;

  categoryList: any[] = [];
  unitList: any[] = [];
  isEditMode = false;
  inventoryObj: any = { id: 0 };


  ngOnInit(): void {
    this.createForm();
    this.onResize();
    this.getCategories();
    this.getUnits();
    this.listenToUnitChange();

    const inventoryId = Number(this.AR.snapshot.paramMap.get('id'));
    if (inventoryId) {
      this.getAnInventoryById(inventoryId);
    }
  }

  private createForm(): void {
    this.inventoryForm = this.fb.group({
      name: ['', Validators.required],
      category_id: ['', Validators.required],
      quantity: [null, Validators.required],
      unit: ['', Validators.required],
      is_active: [true]
    });
  }

  onResize(): void {
    this.breakpoint = window.innerWidth <= 960 ? 1 : 3;
  }

  private getCategories(): void {
    const categoryControl = this.inventoryForm.get('category_id');

    this.isCategoryLoading = true;
    this.categoryList = [];
    this.inventoryForm.get('category_id')?.disable();  //// keep disabled while loading
    const payload = {page_number: 1, page_size: 100, search_value: ''} as IGenericPagination;
    this._inventoryService.getCategories(payload)
      .pipe(finalize(() => this.isCategoryLoading = false))
      .subscribe({
        next: (res) => {
          if (res?.status) {
            console.log('Categories response:', res);
            this.categoryList = res.data ?? [];
            if (this.categoryList.length > 0) {
              categoryControl?.enable();   //// enable only when categories exists
            }
          } else {
            this._snackbar.openSnackBar(res?.message || 'Failed to fetch categories', 'error');
          }
        },
        error: (err) => {
          this._snackbar.openSnackBar('Failed to fetch categories', 'error');
        }
      });
  }

  private getUnits(): void {
    const unitControl = this.inventoryForm.get('unit');

    this.isUnitsLoading = true;
    this.inventoryForm.get('unit')?.disable();  //// keep disabled while loading
    this._inventoryService.getInventoryUnits()
      .pipe(finalize(() => this.isUnitsLoading = false))
      .subscribe({
        next: (res) => {
          if (res?.status) {
            this.unitList = res.data ?? [];
            if (this.unitList.length > 0) {
              unitControl?.enable();   //// enable only when units exists
            }
          } else {
            this._snackbar.openSnackBar(res?.message || 'Failed to fetch units', 'error');
          }
        },
        error: (err) => {
          this._snackbar.openSnackBar('Failed to fetch units', 'error');
        }
      });
  }

  listenToUnitChange() {
    const quantityCtrl = this.inventoryForm.get('quantity');

    this.inventoryForm.get('unit')?.valueChanges.subscribe(unit => {
      if (!quantityCtrl) return;

      if (unit === 'pcs') {
        quantityCtrl.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]+$')   // integer only
        ]);
      } else {
        quantityCtrl.setValidators([
          Validators.required,
          Validators.min(1)
        ]);
      }

      quantityCtrl.updateValueAndValidity();
    });
  }

  formatQuantity(event: any) {
    let value = event.target.value;
    if (value && value.includes('.')) {
      const parts = value.split('.');
      event.target.value = parts[0] + '.' + parts[1].substring(0, 3);
    }
  }

  blockInvalidKeys(event: KeyboardEvent) {
    const invalidKeys = ['-', 'e', 'E', '+'];
    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  insertUpdateInventory(): void {
    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }
    const payload = {
      ...this.inventoryForm.value,
      id: this.inventoryObj?.id || 0,
      is_deleted: false
    };
    this.isLoading = true;
    this._inventoryService.insertUpdateInventory(payload)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          if (res?.status) {
            this._snackbar.openSnackBar(res?.message || 'Inventory saved successfully', "success");
            this._router.navigate(['hms/inventory/list-inventory']);
          } else {
            this._snackbar.openSnackBar(res?.message || 'Failed to save inventory', "error");
          }
        },
        error: (err) => {
          const msg = err.error?.message || 'A error occured while saving inventory';
          this._snackbar.openSnackBar(msg, 'error');
        }
      });
  }

  private getAnInventoryById(inventoryId: number): void {
    if (inventoryId > 0) {
      this.isPageLoad = true;
      this._inventoryService.getInventoryById(inventoryId)
        .pipe(finalize(() => this.isPageLoad = false))
        .subscribe({
          next: (res) => {
            if (res?.status) {
              this.isEditMode = true;
              this.inventoryObj = res.data;
              console.log("001");
              this.inventoryForm.patchValue({
                id: this.inventoryObj.id,
                name: this.inventoryObj.name,
                category_id: this.inventoryObj.category_id,
                quantity: this.inventoryObj.quantity,
                unit: this.inventoryObj.unit,
                is_active: this.inventoryObj.is_active
              });
              console.log("002");
            } else {
              this._snackbar.openSnackBar(res?.message || 'Failed to load inventory', 'error');
            }
          },
          error: (err) => {
            const msg = err.error?.message || 'A error occured while loading inventory';
            this._snackbar.openSnackBar(msg, 'error');
          }
        });
    }
  }



}
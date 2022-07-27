import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletValue } from 'src/app/core/models/values/wallet-value';
import { WalletService } from 'src/app/core/services/api/wallet.service';

@Component({
  selector: 'app-create-transaction-dialog',
  templateUrl: './create-transaction-dialog.component.html',
  styleUrls: ['./create-transaction-dialog.component.scss']
})
export class CreateTransactionDialogComponent implements OnInit {
  @Input() visible: boolean;
  @Output() visibleChanged = new EventEmitter<boolean>()
  form: FormGroup;
  transactionTypes = ['expense', 'invoice'];
  errors: string[];
  wallets: WalletValue[] = [];

  constructor(private walletService: WalletService,
    private formBuilder: FormBuilder) { }

  toDefault() {
    this.form.patchValue({
      walletId: '',
      type: '',
      topic: '',
      amount: 0,
      tax: 0
    })
  }

  cancel() {
    this.toDefault();
    this.visibleChanged.next(false);
  }

  async save() {
    this.errors = [];
    if(!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.walletService.performTransaction(this.form.value)
    .subscribe({next: response => {
      this.toDefault();
      this.visibleChanged.next(false);
    }, error: (response : HttpErrorResponse) => {
      this.errors = response.error.messages;
    }});

  }

  ngOnInit(): void {
    this.walletService.getWallets()
    .subscribe(wallets => {
      this.wallets = wallets;
      if (this.wallets && this.wallets.length > 0) {
        this.form.patchValue({walletId: this.wallets[0].id})
      }
    })

    this.form = this.formBuilder.group({
      walletId: ['', Validators.required],
      type: [this.transactionTypes[0], Validators.required],
      topic: ['', Validators.required],
      amount: ['', Validators.required],
      tax: ['', Validators.required]
    })
  }
}

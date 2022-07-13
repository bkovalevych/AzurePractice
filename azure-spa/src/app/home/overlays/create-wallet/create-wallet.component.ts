import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { WalletService } from 'src/app/core/services/api/wallet.service';

@Component({
  selector: 'app-create-wallet',
  templateUrl: 'create-wallet.component.html',
  styles: [
  ]
})
export class CreateChatComponent implements OnInit {
  @Input() visible: boolean;
  @Output() visibleChanged = new EventEmitter<boolean>()

  errors: string[];
  walletName: string;

  constructor(private walletService: WalletService) { }

  async loadUsers(searchValue: string) {
  }
  toDefault() {
    this.walletName = '';
  }
  cancel() {
    this.toDefault();
    this.visibleChanged.next(false);
  }

  async save() {
    this.errors = [];
    if(!this.walletName) {
      this.errors.push("Wallet name is required");
    }
    if (this.errors.length == 0) {
      this.walletService.createWallet(this.walletName)
      .subscribe({next: wallet => {
        this.toDefault();
        this.visibleChanged.next(false);
      }, error: (err : HttpErrorResponse) => {
        this.errors.push(err.error);
      }});
    }
  }

  ngOnInit(): void {
  }
}

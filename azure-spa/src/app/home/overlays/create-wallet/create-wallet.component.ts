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
      await this.createWallet(this.walletName);
      this.toDefault();
      this.visibleChanged.next(false);
    }
  }

  async createWallet(name: string) {
    return firstValueFrom(this.walletService.createWallet(name));
  }

  ngOnInit(): void {
  }
}

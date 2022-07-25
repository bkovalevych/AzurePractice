import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { WalletValue } from 'src/app/core/models/values/wallet-value';
import { WalletService } from 'src/app/core/services/api/wallet.service';

@Component({
  selector: 'app-dashboard-wallets',
  templateUrl: './dashboard-wallets.component.html',
  styleUrls: ['./dashboard-wallets.component.scss']
})
export class DashboardWalletsComponent implements OnInit {
  wallets: WalletValue[] = [];
  private readonly _destroying$ = new Subject<void>();

  constructor(private walletService: WalletService) { }

  ngOnInit(): void {
    this.loadWallets();
  }

  loadWallets() {
    this.walletService.getWallets()
    .subscribe(payload => {
      this.wallets = payload;
    })
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}

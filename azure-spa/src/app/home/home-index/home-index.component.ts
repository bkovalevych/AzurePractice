import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserValue } from 'src/app/core/models/values/user-value';
import { WalletValue } from 'src/app/core/models/values/wallet-value';
import { WalletService } from 'src/app/core/services/api/wallet.service';

@Component({
  selector: 'app-home-index',
  templateUrl: './home-index.component.html',
  styles: []
})
export class HomeIndexComponent implements OnInit, OnDestroy {
  user: UserValue;
  openPopupToCreateWallet = false;
  wallets: WalletValue[];

  private readonly _destroying$ = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private walletService: WalletService) { }


  ngOnInit(): void {
    this.activatedRoute.queryParams
    .pipe(takeUntil(this._destroying$))
    .subscribe(queryParams => {
      this.oncreateWalletModalVisibilityChanged(queryParams['openPopupToCreateWallet']);
    })

    this.loadWallets();
  }

  oncreateWalletModalVisibilityChanged(visible: boolean) {
    this.openPopupToCreateWallet = visible;
    if (!visible) {
      this.router.navigate([], {
        queryParams: {
          openPopupToCreateWallet: null
        },
        queryParamsHandling: 'merge'
      })
    }
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

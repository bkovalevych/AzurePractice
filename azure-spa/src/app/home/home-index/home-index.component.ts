import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventType } from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';
import { TransactionValue } from 'src/app/core/models/values/transaction-value';
import { WalletValue } from 'src/app/core/models/values/wallet-value';
import { WalletService } from 'src/app/core/services/api/wallet.service';

@Component({
  selector: 'app-home-index',
  templateUrl: './home-index.component.html',
  styles: []
})
export class HomeIndexComponent implements OnInit, OnDestroy {
  isAuth: boolean = false;
  openPopupToCreateWallet = false;
  transactions: TransactionValue[];
  wallets: {[key: string]: WalletValue};
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private msalBroadcastService: MsalBroadcastService,
    private authService: MsalService,
    private walletService: WalletService) { }


  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((eventMessage) => eventMessage.eventType == EventType.LOGIN_SUCCESS
          || eventMessage.eventType == EventType.LOGOUT_SUCCESS
          || eventMessage.eventType == EventType.SSO_SILENT_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((event) => {
        this.isAuth = event.eventType === EventType.LOGIN_SUCCESS;
        if (this.isAuth) {
          this.loadTransactions();
        }
      });
    this.isAuth = this.authService.instance.getActiveAccount() != null;
    if (this.isAuth) {
      this.loadTransactions();
    }
    this.activatedRoute.queryParams
      .pipe(takeUntil(this._destroying$))
      .subscribe(queryParams => {
        this.oncreateWalletModalVisibilityChanged(queryParams['openPopupToCreateWallet']);
      })
  }

  loadTransactions() {
    let from = new Date();
    from.setDate(from.getDate() - 7)
    from.setHours(0);
    from.setMinutes(0);
    from.setSeconds(0);
    this.walletService.getTransactions(from, new Date())
    .subscribe(({transactions, wallets}) => {
      this.wallets = wallets.reduce((acc, wallet) => {
        acc[wallet.id] = wallet;
        return acc;
      }, {});
      this.transactions = transactions;
    });

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

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
